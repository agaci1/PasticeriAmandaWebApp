package com.amanda.pasticeri.util;

public final class UploadPathResolver {

    private UploadPathResolver() {}

    public static String resolveUploadDirectory() {
        String railwayPath = System.getenv("RAILWAY_VOLUME_MOUNT_PATH");
        String currentDir = System.getProperty("user.dir");

        if (railwayPath != null && !railwayPath.trim().isEmpty()) {
            String normalized = railwayPath.endsWith("/") ? railwayPath : railwayPath + "/";
            if (normalized.endsWith("/uploads/")) {
                return normalized;
            }
            if (normalized.endsWith("/uploads")) {
                return normalized + "/";
            }
            return normalized + "uploads/";
        }

        if (currentDir != null && currentDir.contains("/app")) {
            return "/app/uploads/";
        }

        return "uploads/";
    }

    public static String toFileLocation(String uploadDir) {
        String normalized = uploadDir.endsWith("/") ? uploadDir : uploadDir + "/";
        return "file:" + normalized;
    }
}
