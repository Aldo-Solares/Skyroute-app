package com.skyroute.backend.records;

import java.util.List;

public record PlaceLigthRecord(String name, String bestTime, String location, List<PicturesPlaceRecord> picturesPlace,
        String categoryName) {
}