package com.skyroute.backend.service;

import java.util.List;

import com.skyroute.backend.records.PlaceLigthRecord;

public interface UserPlaceService {
    void createRelationship(String user, String place);
    void deleteRelationship(String user, String place);
    List<PlaceLigthRecord> getAllByUserLigth(String userName);
}