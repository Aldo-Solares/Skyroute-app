package com.skyroute.backend.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.skyroute.backend.records.PlaceRecord;

public interface PlaceService {
	PlaceRecord createPlace(PlaceRecord place,List<MultipartFile> files,String catName);
	List<PlaceRecord> getAllByName();
	List<PlaceRecord> getAllByNameCat(String categoryName,String userName);
	PlaceRecord updatePlace(PlaceRecord place,List<MultipartFile> files,String catName,String originalName);
	void deletePlace(String placeName);
}
