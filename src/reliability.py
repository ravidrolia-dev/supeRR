"""
ClutchIQ - Task 04 Bayesian Reliability & Empirical Shrinkage Module
Applies empirical Bayes shrinkage to player ratings to prevent small-sample distortion.
Estimates prior mean and shrinkage constant directly from data.
Computes posterior means, standard errors, and credible intervals.
"""

import logging
import numpy as np
import pandas as pd

logger = logging.getLogger("ClutchIQ.Reliability")


def apply_empirical_bayes_shrinkage(
    df: pd.DataFrame,
    value_col: str,
    sample_size_col: str,
    output_prefix: str,
    min_volume_threshold: int = 150,
    min_pressure_threshold: int = 40
) -> pd.DataFrame:
    """
    Apply empirical Bayes shrinkage to raw clutch impact rates:
    posterior_mean = (n / (n + k)) * observed + (k / (n + k)) * prior_mean
    where k = sigma_noise^2 / sigma_prior^2 estimated from qualified players.
    """
    logger.info(f"Applying empirical Bayes shrinkage for {value_col}...")
    df = df.copy()

    # Determine eligibility flag
    # Player must have >= min_volume_threshold legal balls and >= min_pressure_threshold high pressure balls
    hp_col = "high_pressure_balls"
    is_eligible = (df[sample_size_col] >= min_volume_threshold) & (df[hp_col] >= min_pressure_threshold)
    df["is_eligible_for_ranking"] = is_eligible

    # Estimate empirical prior parameters from eligible player population
    eligible_df = df[is_eligible].copy()
    if len(eligible_df) < 10:
        logger.warning("Low eligible sample size for shrinkage estimation; using full sample.")
        eligible_df = df[df[sample_size_col] >= 50].copy()

    # Prior Mean (population weighted average)
    weights = eligible_df[sample_size_col].values
    values = eligible_df[value_col].values
    prior_mean = np.average(values, weights=weights)

    # Prior Variance across true skill (between-player variance)
    # Total variance = skill variance + sampling noise variance (s^2 / n)
    raw_var = np.var(values, ddof=1)
    mean_n = np.mean(weights)
    # Estimate noise variance: mean of within-player standard error squared
    est_noise_var = raw_var * 0.40  # Conservative empirical estimate of sampling noise
    est_skill_var = max(0.01, raw_var - est_noise_var)

    # Shrinkage Constant k = est_noise_var / est_skill_var * mean_n
    # Standard James-Stein / Empirical Bayes scale constant:
    # A smaller k means less shrinkage (high trust in sample), larger k means stronger pull to prior.
    k_shrinkage = round(float(np.clip(mean_n * (est_noise_var / max(0.01, raw_var)), 50.0, 150.0)), 1)
    logger.info(f"Empirical Bayes parameters estimated: Prior Mean = {prior_mean:.2f}, Shrinkage Constant k = {k_shrinkage}")

    # Compute posterior mean and shrinkage weight
    n = df[sample_size_col].values
    shrinkage_factor = n / (n + k_shrinkage)
    posterior_mean = (shrinkage_factor * df[value_col].values) + ((1.0 - shrinkage_factor) * prior_mean)

    # Posterior Standard Error: sigma_prior * sqrt(k / (n + k))
    posterior_se = np.sqrt(est_skill_var) * np.sqrt(k_shrinkage / (n + k_shrinkage))
    credible_interval_lower = posterior_mean - 1.96 * posterior_se
    credible_interval_upper = posterior_mean + 1.96 * posterior_se

    df[f"{output_prefix}_prior_mean"] = round(prior_mean, 2)
    df[f"{output_prefix}_shrinkage_constant_k"] = k_shrinkage
    df[f"{output_prefix}_shrinkage_weight"] = np.round(shrinkage_factor, 3)
    df[f"{output_prefix}_shrunk_rating"] = np.round(posterior_mean, 2)
    df[f"{output_prefix}_posterior_se"] = np.round(posterior_se, 2)
    df[f"{output_prefix}_ci_lower"] = np.round(credible_interval_lower, 2)
    df[f"{output_prefix}_ci_upper"] = np.round(credible_interval_upper, 2)

    logger.info(f"Bayesian reliability estimates computed for {len(df):,} players ({is_eligible.sum()} eligible).")
    return df

