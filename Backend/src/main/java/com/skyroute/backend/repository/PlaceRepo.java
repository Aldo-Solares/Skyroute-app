package com.skyroute.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.skyroute.backend.model.Places;

@Repository
public interface PlaceRepo extends JpaRepository<Places, Long> {

	Optional<Places> findByName(String name);

	@Query("""
			    SELECT p
			    FROM Places p
			    JOIN p.users u
			    WHERE u.username = :username
			""")
	List<Places> findAllByUsername(@Param("username") String username);

	List<Places> findByCategory_CategoryName(String categoryName);
}