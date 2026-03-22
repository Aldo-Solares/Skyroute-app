package com.skyroute.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.skyroute.backend.comparators.CategoryNameComparator;
import com.skyroute.backend.exceptions.ElementAlreadyExistsException;
import com.skyroute.backend.exceptions.ElementNotFoundException;
import com.skyroute.backend.model.Category;
import com.skyroute.backend.records.CategoryRecord;
import com.skyroute.backend.repository.CategoryRepo;

@Service
public class CategoryServiceImpl implements CategoryService {

	@Autowired
	private CategoryRepo categoryRepo;

	@Autowired
	private FileService fileService;

	@Override
	public List<CategoryRecord> getAlls() {

		List<Category> categories = categoryRepo.findAll();

		if (categories.isEmpty()) {
			throw new ElementNotFoundException("No categories found");
		}

		List<CategoryRecord> records = new ArrayList<>();

		for (Category cat : categories) {
			records.add(new CategoryRecord(
					cat.getCategoryName(),
					cat.getDescription(),
					cat.getImagePath()));
		}

		return records.stream()
				.sorted(new CategoryNameComparator())
				.toList();
	}

	@Override
	public CategoryRecord createCategory(CategoryRecord catRec, MultipartFile img) {

		Category existing = categoryRepo.findByCategoryName(catRec.categoryName());

		if (existing != null) {
			throw new ElementAlreadyExistsException(
					"Category already exists: " + catRec.categoryName());
		}

		Category category = new Category();
		category.setCategoryName(catRec.categoryName());
		category.setDescription(catRec.description());

		if (img != null && !img.isEmpty()) {
			String fileName = fileService.uploadSingleImage(img, "categories");
			category.setImagePath(fileName);
		}

		categoryRepo.save(category);

		return new CategoryRecord(
				category.getCategoryName(),
				category.getDescription(),
				category.getImagePath());
	}

	@Override
	public void deleteCategory(String name) {

		Category category = categoryRepo.findByCategoryName(name);

		if (category == null) {
			throw new ElementNotFoundException("Category not found: " + name);
		}

		categoryRepo.delete(category);
	}

	@Override
	public CategoryRecord updateCategory(String name, CategoryRecord catRec, MultipartFile img) {

		Category category = categoryRepo.findByCategoryName(name);

		if (category == null) {
			throw new ElementNotFoundException("Category not found: " + name);
		}

		category.setCategoryName(catRec.categoryName());
		category.setDescription(catRec.description());

		if (img != null && !img.isEmpty()) {
			String fileName = fileService.uploadSingleImage(img, "categories");
			category.setImagePath(fileName);
		}

		categoryRepo.save(category);

		return new CategoryRecord(
				category.getCategoryName(),
				category.getDescription(),
				category.getImagePath());
	}
}