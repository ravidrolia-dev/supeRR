import os
import pandas as pd
import numpy as np
from app.config import settings

class DataLoader:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DataLoader, cls).__new__(cls)
            cls._instance._load_datasets()
        return cls._instance

    def _load_datasets(self):
        print("DataLoader: Caching core datasets into memory...")
        r_dir = settings.RANKINGS_DIR
        d_dir = settings.DATA_DIR
        
        # 1. Rankings (V2 Historical)
        self.top_combined_batters = pd.read_csv(os.path.join(r_dir, "top10_combined_batters.csv"))
        self.top_combined_bowlers = pd.read_csv(os.path.join(r_dir, "top10_combined_bowlers.csv"))
        self.top_ipl_batters = pd.read_csv(os.path.join(r_dir, "top10_ipl_batters.csv"))
        self.top_ipl_bowlers = pd.read_csv(os.path.join(r_dir, "top10_ipl_bowlers.csv"))
        self.top_t20i_batters = pd.read_csv(os.path.join(r_dir, "top10_t20i_batters.csv"))
        self.top_t20i_bowlers = pd.read_csv(os.path.join(r_dir, "top10_t20i_bowlers.csv"))

        # 1b. Rankings (V3 Production Approved)
        self.top_combined_batters_v3 = pd.read_csv(os.path.join(r_dir, "top10_combined_batters_v3.csv"))
        self.top_combined_bowlers_v3 = pd.read_csv(os.path.join(r_dir, "top10_combined_bowlers_v3.csv"))
        self.top_ipl_batters_v3 = pd.read_csv(os.path.join(r_dir, "top10_ipl_batters_v3.csv"))
        self.top_ipl_bowlers_v3 = pd.read_csv(os.path.join(r_dir, "top10_ipl_bowlers_v3.csv"))
        self.top_t20i_batters_v3 = pd.read_csv(os.path.join(r_dir, "top10_t20i_batters_v3.csv"))
        self.top_t20i_bowlers_v3 = pd.read_csv(os.path.join(r_dir, "top10_t20i_bowlers_v3.csv"))

        # 1c. Pressure Prevention Candidates (Experimental)
        self.top_prevention_batters = pd.read_csv(os.path.join(r_dir, "top10_pressure_prevention_batters.csv"))
        self.top_prevention_bowlers = pd.read_csv(os.path.join(r_dir, "top10_pressure_prevention_bowlers.csv"))
        cat_path = os.path.join(r_dir, "task08_1_player_categories.csv")
        if not os.path.exists(cat_path):
            cat_path = os.path.join(settings.ROOT_DIR, "reports", "pressure", "task08_1_player_categories.csv")
        self.player_categories = pd.read_csv(cat_path)
        self.player_ppi = pd.read_csv(os.path.join(d_dir, "player_pressure_prevention_ratings.csv"))
        self.player_ratings_v3 = pd.read_csv(os.path.join(d_dir, "player_clutch_ratings_v3.csv"))

        # 1d. Unified Integrated Scouting Rankings (Task 09.2)
        unified_bat_path = os.path.join(r_dir, "unified_integrated_batters.csv")
        if os.path.exists(unified_bat_path):
            self.unified_batters = pd.read_csv(unified_bat_path)
        else:
            self.unified_batters = pd.DataFrame()
            
        unified_bowl_path = os.path.join(r_dir, "unified_integrated_bowlers.csv")
        if os.path.exists(unified_bowl_path):
            self.unified_bowlers = pd.read_csv(unified_bowl_path)
        else:
            self.unified_bowlers = pd.DataFrame()

        # 1e. SupeRR 10 Under-Pressure Leaderboards (Task 09.6)
        superr10_bat_path = os.path.join(r_dir, "task09_6_final_batters.csv")
        if not os.path.exists(superr10_bat_path):
            superr10_bat_path = os.path.join(settings.ROOT_DIR, "task09_6_final_batters.csv")
        if os.path.exists(superr10_bat_path):
            self.superr10_batters = pd.read_csv(superr10_bat_path)
        else:
            self.superr10_batters = pd.DataFrame()

        superr10_bowl_path = os.path.join(r_dir, "task09_6_final_bowlers.csv")
        if not os.path.exists(superr10_bowl_path):
            superr10_bowl_path = os.path.join(settings.ROOT_DIR, "task09_6_final_bowlers.csv")
        if os.path.exists(superr10_bowl_path):
            self.superr10_bowlers = pd.read_csv(superr10_bowl_path)
        else:
            self.superr10_bowlers = pd.DataFrame()

        # 1f. Full Unified All-Qualified Cohorts (Task 10)
        unified_all_bat_path = os.path.join(d_dir, "unified_all_batters_70_20_10.csv")
        if os.path.exists(unified_all_bat_path):
            self.unified_all_batters = pd.read_csv(unified_all_bat_path)
        else:
            self.unified_all_batters = pd.DataFrame()

        unified_all_bowl_path = os.path.join(d_dir, "unified_all_bowlers_70_20_10.csv")
        if os.path.exists(unified_all_bowl_path):
            self.unified_all_bowlers = pd.read_csv(unified_all_bowl_path)
        else:
            self.unified_all_bowlers = pd.DataFrame()
        
        # 2. Player selection evidence & reconciliations
        self.evidence = pd.read_csv(os.path.join(r_dir, "player_selection_evidence.csv"))
        self.bowling_decomp = pd.read_csv(os.path.join(r_dir, "task05_2_bowling_reconciliation.csv"))
        self.wicket_sens = pd.read_csv(os.path.join(r_dir, "wicket_value_sensitivity.csv"))
        self.comp_equity = pd.read_csv(os.path.join(r_dir, "task05_2_competition_equity.csv"))
        self.ranking_stability = pd.read_csv(os.path.join(r_dir, "task05_1_ranking_stability.csv"))
        
        # 3. Processed Player Ratings & Mapping
        self.player_ratings = pd.read_csv(os.path.join(d_dir, "player_clutch_ratings.csv"))
        self.mapping = pd.read_csv(settings.MAPPING_PATH)
        
        # 4. Match Context & Pre-computed Delivery Metrics
        self.match_context = pd.read_csv(os.path.join(d_dir, "match_context.csv"))
        
        # Pre-compute team lookup
        self.player_teams = self.mapping.groupby("player_id")["team_name"].unique().to_dict()
        self.player_comps = self.mapping.groupby("player_id")["comp_name"].unique().to_dict()
        
        # Pre-aggregate phase and comp stats from delivery_pressure_scores
        print("DataLoader: Indexing delivery features for fast query response...")
        deliv_path = os.path.join(d_dir, "delivery_pressure_scores.csv")
        deliv = pd.read_csv(deliv_path, low_memory=False)
        sub = deliv[deliv["is_primary_scope"]].copy()
        
        # Cache overall pressure distribution
        self.bpi_bins = pd.cut(sub["batter_pressure_index"], bins=[0, 35, 50, 65, 80, 100], 
                               labels=["Low (<35)", "Moderate (35-50)", "High (50-65)", "Extreme (65-80)", "Maximum (80+)"]).value_counts().to_dict()
        self.bowlpi_bins = pd.cut(sub["bowler_pressure_index"], bins=[0, 35, 50, 65, 80, 100], 
                                  labels=["Low (<35)", "Moderate (35-50)", "High (50-65)", "Extreme (65-80)", "Maximum (80+)"]).value_counts().to_dict()
        
        # Pre-aggregate player phase & comp breakdowns
        # Batting
        self.bat_phase = sub.groupby(["striker_id", "innings_phase_before"]).agg(
            balls=("is_legal_ball", "sum"),
            runs=("batter_runs", "sum"),
            hp_balls=("batter_pressure_index", lambda x: (x >= 65.0).sum()),
            w_rar=("batter_runs_added", lambda x: (x * (sub.loc[x.index, "batter_pressure_index"] / 50.0)).sum())
        ).reset_index()
        
        self.bat_comp = sub.groupby(["striker_id", "competition_category"]).agg(
            balls=("is_legal_ball", "sum"),
            runs=("batter_runs", "sum"),
            hp_balls=("batter_pressure_index", lambda x: (x >= 65.0).sum()),
            w_rar=("batter_runs_added", lambda x: (x * (sub.loc[x.index, "batter_pressure_index"] / 50.0)).sum())
        ).reset_index()
        
        # Bowling
        self.bowl_phase = sub.groupby(["bowler_id", "innings_phase_before"]).agg(
            balls=("is_legal_ball", "sum"),
            runs_c=("bowler_runs_conceded", "sum"),
            wkts=("is_bowler_wicket", "sum"),
            hp_balls=("bowler_pressure_index", lambda x: (x >= 65.0).sum()),
            w_rbe=("bowler_runs_saved", lambda x: (x * (sub.loc[x.index, "bowler_pressure_index"] / 50.0)).sum()),
            w_wkt=("bowler_wickets_added", lambda x: (x * (sub.loc[x.index, "bowler_pressure_index"] / 50.0)).sum())
        ).reset_index()
        
        self.bowl_comp = sub.groupby(["bowler_id", "competition_category"]).agg(
            balls=("is_legal_ball", "sum"),
            runs_c=("bowler_runs_conceded", "sum"),
            wkts=("is_bowler_wicket", "sum"),
            hp_balls=("bowler_pressure_index", lambda x: (x >= 65.0).sum()),
            w_rbe=("bowler_runs_saved", lambda x: (x * (sub.loc[x.index, "bowler_pressure_index"] / 50.0)).sum()),
            w_wkt=("bowler_wickets_added", lambda x: (x * (sub.loc[x.index, "bowler_pressure_index"] / 50.0)).sum())
        ).reset_index()
        
        # Match count totals
        self.total_matches = len(self.match_context[self.match_context["is_primary_scope"]])
        self.total_deliveries = len(sub)
        self.total_legal_balls = int(sub["is_legal_ball"].sum())
        self.hp_deliveries = int((sub["batter_pressure_index"] >= 65.0).sum())
        
        print("DataLoader: Initialization complete.")

data_loader = DataLoader()

