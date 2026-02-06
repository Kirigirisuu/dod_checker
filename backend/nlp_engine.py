from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_distances, cosine_similarity
import umap
import numpy as np

class CultureAnalyzer:
    def __init__(self):
        print("Loading SentenceTransformer model...")
        # Using a small, fast model for MVP
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        print("Model loaded.")

    def compute_gap(self, corp_text: str, emp_texts: list[str]) -> float:
        """
        Computes the cosine distance (0-2) between the corporate text
        and the average embedding of employee texts.
        Lower distance = Higher alignment.
        """
        if not emp_texts:
            return 0.0
        
        corp_emb = self.model.encode([corp_text])
        emp_embs = self.model.encode(emp_texts)
        
        # Average employee embedding
        avg_emp_emb = np.mean(emp_embs, axis=0).reshape(1, -1)
        
        # Cosine distance
        dist = cosine_distances(corp_emb, avg_emp_emb)[0][0]
        return float(dist)

    def compute_dimensions(self, text: str, dimensions: dict) -> dict:
        """
        Computes similarity scores (0-1) between the text and each cultural dimension.
        dimensions dict example: {"Innovation": ["innovation", "agile", ...]}
        """
        emb = self.model.encode([text])
        results = {}
        for dim, keywords in dimensions.items():
            if not keywords:
                results[dim] = 0.0
                continue
                
            kw_embs = self.model.encode(keywords)
            avg_kw_emb = np.mean(kw_embs, axis=0).reshape(1, -1)
            sim = cosine_similarity(emb, avg_kw_emb)[0][0]
            # Ensure non-negative for visualization convenience (though cosine can be negative)
            results[dim] = max(0.0, float(sim))
        return results

    def compute_umap(self, texts: list[str], labels: list[str]) -> list:
        """
        Reduces dimensionality to 2D for visualization.
        """
        if len(texts) < 3: 
            # Not enough data for UMAP usually, return dummy stats
            return [{"x": 0.0, "y": 0.0, "text": t, "label": l} for t, l in zip(texts, labels)]

        embs = self.model.encode(texts)
        
        # n_neighbors must be smaller than dataset size
        n_neighbors = min(15, len(texts) - 1)
        if n_neighbors < 2:
            n_neighbors = 2
            
        reducer = umap.UMAP(n_neighbors=n_neighbors, n_components=2, random_state=42, min_dist=0.1)
        coords = reducer.fit_transform(embs)
        
        return [
            {"x": float(c[0]), "y": float(c[1]), "text": t, "label": l} 
            for c, t, l in zip(coords, texts, labels)
        ]
