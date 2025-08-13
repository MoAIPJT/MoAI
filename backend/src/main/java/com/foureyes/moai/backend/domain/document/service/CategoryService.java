package com.foureyes.moai.backend.domain.document.service;

import com.foureyes.moai.backend.domain.document.dto.CategoryItemDto;
import com.foureyes.moai.backend.domain.document.dto.request.CreateCategoryRequest;
import com.foureyes.moai.backend.domain.document.dto.request.EditCategoryRequest;

import java.util.List;

public interface CategoryService {
    void createCategory(int userId, CreateCategoryRequest req);
    void editCategory(int userId, int categoryId, EditCategoryRequest req);
    void deleteCategory(int userId, int categoryId);
    List<CategoryItemDto> getCategories(int userId, int studyId);
}
