package com.skyroute.backend.controller;

import java.util.List;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.skyroute.backend.records.PlaceRecord;
import com.skyroute.backend.service.PlaceService;

@RestController
@RequestMapping("/api/places")
public class PlaceController {

	private final PlaceService placeService;

	public PlaceController(PlaceService placeService) {
		this.placeService = placeService;
	}

	// =========================
	// CREATE (JSON + FILES)
	// =========================
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<PlaceRecord> createPlace(
			@RequestPart("placeData") PlaceRecord place,
			@RequestPart(value = "files", required = false) List<MultipartFile> files,
			@RequestParam String categoryName) {

		PlaceRecord response = placeService.createPlace(place, files, categoryName);

		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	// =========================
	// UPDATE (JSON + FILES opcional)
	// =========================
	@PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<PlaceRecord> updatePlace(
			@RequestPart("placeData") PlaceRecord place,
			@RequestPart(value = "files", required = false) List<MultipartFile> files,
			@RequestParam String categoryName,
			@RequestParam String originalName) {

		PlaceRecord response = placeService.updatePlace(place, files, categoryName, originalName);

		return ResponseEntity.ok(response);
	}

	// =========================
	// GET ALL
	// =========================
	@GetMapping
	public ResponseEntity<List<PlaceRecord>> getAllPlaces() {
		return ResponseEntity.ok(placeService.getAllByName());
	}

	// =========================
	// GET BY CATEGORY + USER
	// =========================
	@GetMapping("/category/{categoryName}/user/{userName}")
	public ResponseEntity<List<PlaceRecord>> getAllPlacesByCat(
			@PathVariable String categoryName,
			@PathVariable String userName) {

		return ResponseEntity.ok(
				placeService.getAllByNameCat(categoryName, userName));
	}

	// =========================
	// DELETE
	// =========================
	@DeleteMapping("/{placeName}")
	public ResponseEntity<String> deletePlace(@PathVariable String placeName) {

		placeService.deletePlace(placeName);

		return ResponseEntity.ok("Delete successfully!");
	}
}