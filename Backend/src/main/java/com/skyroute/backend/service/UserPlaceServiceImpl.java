package com.skyroute.backend.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.skyroute.backend.comparators.PlaceLigthNameComparator;
import com.skyroute.backend.exceptions.ElementNotFoundException;
import com.skyroute.backend.model.Places;
import com.skyroute.backend.model.Users;
import com.skyroute.backend.records.PicturesPlaceRecord;
import com.skyroute.backend.records.PlaceLigthRecord;
import com.skyroute.backend.repository.PlaceRepo;
import com.skyroute.backend.repository.UserRepo;

@Service
public class UserPlaceServiceImpl implements UserPlaceService {

    private final UserRepo userRepository;
    private final PlaceRepo placeRepo;

    public UserPlaceServiceImpl(UserRepo userRepository, PlaceRepo placeRepo) {
        this.userRepository = userRepository;
        this.placeRepo = placeRepo;
    }

    public void createRelationship(String user, String place) {

        Places placeI = placeRepo.findByName(place)
                .orElseThrow(() -> new ElementNotFoundException("Place not found"));

        Users userIns = userRepository.findByUsername(user)
                .orElseThrow(() -> new ElementNotFoundException("User not found"));

        placeI.getUsers().add(userIns);

        placeRepo.save(placeI);
    }

    public List<PlaceLigthRecord> getAllByUserLigth(String userName) {

        userRepository.findByUsername(userName)
                .orElseThrow(() -> new ElementNotFoundException("User not found"));

        List<Places> places = placeRepo.findAllByUsername(userName);

        if (places.isEmpty()) {
            throw new ElementNotFoundException("There are no places");
        }

        List<PlaceLigthRecord> placesR = places.stream().map(place -> {

            List<PicturesPlaceRecord> pics = place.getPicturesPlace().stream()
                    .map(p -> new PicturesPlaceRecord(p.getPath()))
                    .toList();

            return new PlaceLigthRecord(
                    place.getName(),
                    place.getBestTime(),
                    place.getLocation(),
                    pics,
                    place.getCategory().getCategoryName());

        }).sorted(new PlaceLigthNameComparator()).toList();

        return placesR;
    }

    public void deleteRelationship(String user, String place) {

        Places placeI = placeRepo.findByName(place)
                .orElseThrow(() -> new ElementNotFoundException("Place not found"));

        Users userIns = userRepository.findByUsername(user)
                .orElseThrow(() -> new ElementNotFoundException("User not found"));

        placeI.getUsers().remove(userIns);

        placeRepo.save(placeI);
    }
}