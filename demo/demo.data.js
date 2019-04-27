const nodes = [
	{ status: "up", id:"web-frontend", label: "Web Frontend" },
	{ status: "up", id:"mobile-frontend", label: "Mobile Frontend" },

	{ status: "up", id:"api-gateway", label: "API Gateway" },
	{ status: "up", id:"search-service", label: "Search Service" },
	{ status: "up", id:"search-cache", label: "Search Cache" },

	{ status: "up", id:"old-monolith", label: "Old Monolith" },
	{ status: "up", id:"legacy-service", label: "Legacy Service" },
	{ status: "up", id:"legacy-db", label: "Legacy DB" },

	{ status: "up", id:"products-service", label: "Products Service" },
	{ status: "up", id:"products-db", label: "Products DB" },
	{ status: "up", id:"main-db", label: "Main DB" },

	{ status: "up", id:"login-service", label: "Auth Service" },
	{ status: "up", id:"oauth-service", label: "OAuth Service" },
	{ status: "up", id:"users-db", label: "Users DB" },

	{ status: "up", id:"payment", label: "Payment" },
	{ status: "up", id:"invoice-service", label: "Invoice Service" },
	{ status: "up", id:"pdf-generator", label: "PDF Generator" },
	{ status: "up", id:"pdf-queue", label: "PDF Queue" },
	{ status: "up", id:"receipts-service", label: "Receipts Service" },
	{ status: "up", id:"receipts-db", label: "Receipts DB" },

	{ status: "up", id:"upload-service", label: "Upload Service" },
	{ status: "up", id:"upload-storage", label: "Upload Storage" },
	{ status: "up", id:"upload-queue", label: "Upload Queue" },
	{ status: "up", id:"upload-worker", label: "Upload Worker" },
	{ status: "up", id:"uploads-db", label: "Uploads DB" },
	{ status: "up", id:"thumbnail-service", label: "Thumbnail Service" },
	{ status: "up", id:"thumbnail-worker", label: "Thumbnail Worker" },
	{ status: "up", id:"thumbnail-queue", label: "Thumbnail Queue" },
	{ status: "up", id:"video-service", label: "Video Service" },
	{ status: "up", id:"video-storage", label: "Video Storage" },
	{ status: "up", id:"documents-service", label: "Documents Service" },
	{ status: "up", id:"documents-db", label: "Documents DB" },
	{ status: "up", id:"ocr-service", label: "OCR Service" },
	{ status: "up", id:"ocr-queue", label: "OCR Queue" },
	{ status: "up", id:"transcription-service", label: "Transcription Service" },
	{ status: "up", id:"transcription-queue", label: "Transcription Queue" },

	// { status: "up", id:"recommendations-service", label: "Recommendation Service" },
	// { status: "up", id:"recommendations-db", label: "Recommendations DB" },
	{ status: "up", id:"tracking-service", label: "Tracking Service" },
	{ status: "up", id:"tracking-db", label: "Tracking DB" },

	// { status: "up", id:"monitoring-service", label: "Monitoring Service" },
	// { status: "up", id:"monitoring-db", label: "Monitoring DB" },
	{ status: "up", id:"logging-service", label: "Logging Service" }
]

// links by reference
const links = [
	{ source: 'web-frontend', target: 'api-gateway' },
	{ source: 'mobile-frontend', target: 'api-gateway' },

	{ source: 'api-gateway', target: 'search-service' },
	{ source: 'api-gateway', target: 'products-service' },
	{ source: 'api-gateway', target: 'login-service' },
	{ source: 'api-gateway', target: 'invoice-service' },
	{ source: 'api-gateway', target: 'payment' },
	{ source: 'api-gateway', target: 'old-monolith' },
	{ source: 'api-gateway', target: 'invoice-service' },
	{ source: 'api-gateway', target: 'media-service' },
	{ source: 'api-gateway', target: 'upload-service' },
	{ source: 'api-gateway', target: 'documents-service' },
	{ source: 'api-gateway', target: 'video-service' },
	{ source: 'documents-service', target: 'uploads-service' },

	{ source: 'api-gateway', target: 'search-service' },
	{ source: 'search-service', target: 'search-cache' },

	{ source: 'old-monolith', target: 'invoice-service' },
	{ source: 'old-monolith', target: 'products' },
	{ source: 'old-monolith', target: 'legacy-service' },
	{ source: 'old-monolith', target: 'main-db' },
	{ source: 'legacy-service', target: 'legacy-db' },

	{ source: 'products-service', target: 'products-db' },

	{ source: 'invoice-service', target: 'pdf-generator' },
	{ source: 'invoice-service', target: 'documents-service' },
	{ source: 'pdf-generator', target: 'pdf-queue' },
	{ source: 'receipts-service', target: 'receipts-db' },
	{ source: 'receipts-service', target: 'documents-service' },
	{ source: 'documents-service', target: 'documents-db' },
	{ source: 'documents-service', target: 'uploads-service' },
	{ source: 'documents-service', target: 'ocr-service' },
	{ source: 'documents-service', target: 'documents-db' },
	{ source: 'ocr-service', target: 'ocr-queue' },
	{ source: 'transcription-service', target: 'transcription-queue' },

	{ source: 'thumbnail-service', target: 'thumbnail-worker' },
	{ source: 'thumbnail-service', target: 'thumbnail-queue' },
	{ source: 'thumbnail-worker', target: 'thumbnail-queue' },

	{ source: 'documents-service', target: 'thumbnail-service' },
	{ source: 'media-service', target: 'thumbnail-service' },
	{ source: 'media-service', target: 'upload-service' },
	{ source: 'media-service', target: 'video-service' },
	{ source: 'video-service', target: 'video-storage' },
	{ source: 'media-service', target: 'transcription-service' },
	{ source: 'video-service', target: 'transcription-service' },

	{ source: 'upload-service', target: 'upload-queue' },
	{ source: 'upload-service', target: 'upload-storage' },
	{ source: 'upload-service', target: 'uploads-db' },
	{ source: 'upload-worker', target: 'upload-queue' },
	{ source: 'upload-worker', target: 'upload-storage' },

	{ source: 'old-monolith', target: 'tracking-service' },
	{ source: 'old-monolith', target: 'logging-service' },
	{ source: 'api-gateway', target: 'tracking-service' },
	{ source: 'api-gateway', target: 'logging-service' },
	{ source: 'tracking-service', target: 'tracking-db' },
	{ source: 'logging-service', target: 'logging-db' },

	{ source: 'login-service', target: 'users-db' },
	{ source: 'oauth-service', target: 'users-db' },
	{ source: 'documents-service', target: 'oauth-service' },
	// { source: 'media-service', target: 'oauth-service' },
	// { source: 'receipts-service', target: 'oauth-service' },

	// { source: 'old-monolith', target: 'recommendations-service' },
	// { source: 'recommendations-service', target: 'recommendations-db' },
]

module.exports = {
	nodes: nodes,
	links: links
}