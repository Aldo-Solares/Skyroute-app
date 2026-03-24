package com.skyroute.backend.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.skyroute.backend.comparators.CommentDateComparator;
import com.skyroute.backend.exceptions.CommentNotFoundException;
import com.skyroute.backend.exceptions.PlaceNotFoundException;
import com.skyroute.backend.exceptions.UserNotFoundException;
import com.skyroute.backend.model.*;
import com.skyroute.backend.records.*;
import com.skyroute.backend.repository.*;

@Service
public class CommentsServiceImpl implements CommentsService {

	@Autowired
	private CommentsRepo commentsRepo;

	@Autowired
	private PlaceRepo placeRepo;

	@Autowired
	private UserRepo userRepository;

	@Autowired
	private FileService fileService;

	@Override
	public CommentRecord createComm(
			CommentRecord commR,
			List<MultipartFile> files,
			String userName,
			String placeName) {

		Users user = userRepository.findByUsername(userName)
				.orElseThrow(() -> new UserNotFoundException(userName));

		Places place = placeRepo.findByName(placeName)
				.orElseThrow(() -> new PlaceNotFoundException(placeName));

		Comments comment = new Comments();
		comment.setText(commR.text());
		comment.setRate(commR.rate());
		comment.setDate(commR.date());
		comment.setUser(user);
		comment.setPlace(place);

		comment = commentsRepo.save(comment);

		if (files != null && !files.isEmpty()) {
			for (MultipartFile file : files) {

				String fileName = fileService.uploadSingleImage(file, "comments");

				PicturesComments picture = new PicturesComments();
				picture.setPath(fileName);
				picture.setComment(comment);
				comment.getPicturesComms().add(picture);
			}
		}

		commentsRepo.save(comment);

		List<PictureCommentsRecord> picsRecord = new ArrayList<>();
		for (PicturesComments pic : comment.getPicturesComms()) {
			picsRecord.add(new PictureCommentsRecord(pic.getPath()));
		}

		UserRecord userRecord = new UserRecord(user.getUsername(), user.getImgPath());

		return new CommentRecord(
				comment.getText(),
				comment.getRate(),
				comment.getDate(),
				picsRecord,
				userRecord);
	}

	@Override
	public List<CommentRecord> getCommentsByPlace(String placeName) {

		Places place = placeRepo.findByName(placeName)
				.orElseThrow(() -> new PlaceNotFoundException(placeName));

		List<Comments> comments = place.getComms();

		if (comments == null) {
			return new ArrayList<>();
		}

		comments.sort(new CommentDateComparator());

		List<CommentRecord> response = new ArrayList<>();

		for (Comments comment : comments) {

			List<PictureCommentsRecord> pics = new ArrayList<>();

			if (comment.getPicturesComms() != null) {
				for (PicturesComments pic : comment.getPicturesComms()) {
					pics.add(new PictureCommentsRecord(pic.getPath()));
				}
			}

			Users user = comment.getUser();
			UserRecord userRecord = new UserRecord(user.getUsername(), user.getImgPath());

			response.add(new CommentRecord(
					comment.getText(),
					comment.getRate(),
					comment.getDate(),
					pics,
					userRecord));
		}

		return response;
	}

	@Override
	public CommentStatsRecord getCommentsStats(String placeName) {

		placeRepo.findByName(placeName)
				.orElseThrow(() -> new PlaceNotFoundException(placeName));

		Object result = commentsRepo.getStatsByPlace(placeName);

		double average = 0.0;
		long count = 0;

		if (result != null) {

			Object[] stats = (Object[]) result;

			if (stats[0] != null) {
				average = ((Number) stats[0]).doubleValue();
			}

			if (stats[1] != null) {
				count = ((Number) stats[1]).longValue();
			}
		}

		return new CommentStatsRecord(average, count);
	}

	@Override
	public void updateComm(CommentRecord comment, CommentRecord commentNew,
			String placeName, List<MultipartFile> images) {

		String userName = SecurityContextHolder.getContext().getAuthentication().getName();

		Comments commentRes = commentsRepo.findCommentByParams(
				userName, placeName, comment.text(), comment.date())
				.orElseThrow(() -> new CommentNotFoundException("Comment not found"));

		List<PicturesComments> newPictures = new ArrayList<>();

		if (images != null && !images.isEmpty()) {
			for (MultipartFile file : images) {

				String fileName = fileService.uploadSingleImage(file, "comments");

				PicturesComments picture = new PicturesComments();
				picture.setPath(fileName);
				picture.setComment(commentRes);
				commentRes.getPicturesComms().add(picture);
			}
		}

		List<PicturesComments> existing = commentRes.getPicturesComms();

		if (existing == null) {
			existing = new ArrayList<>();
		}

		existing.addAll(newPictures);

		commentRes.setPicturesComms(existing);
		commentRes.setText(commentNew.text());
		commentRes.setRate(commentNew.rate());

		commentsRepo.save(commentRes);
	}

	@Override
	public void delete(CommentRecord commRecord, String placeName) {

		String user = SecurityContextHolder.getContext().getAuthentication().getName();

		Comments comment = commentsRepo.findCommentByParams(user, placeName, commRecord.text(), commRecord.date())
				.orElseThrow(() -> new CommentNotFoundException("Comment not found"));

		if (!comment.getUser().getUsername().equals(user)) {
			throw new RuntimeException("You cannot delete this comment");
		}

		commentsRepo.delete(comment);
	}
}