package com.skyroute.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.skyroute.backend.model.PicturesPlace;

@Repository
public interface PicturesPlaceRepo extends JpaRepository<PicturesPlace, Long> {
    List<PicturesPlace> findByPlace_Id(Long placeId);

}
