package com.skyroute.backend.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.skyroute.backend.records.CommentRecord;
import com.skyroute.backend.records.CommentStatsRecord;

public interface CommentsService {

	CommentRecord createComm(CommentRecord commR, List<MultipartFile> files, String userName, String placeName);

	List<CommentRecord> getCommentsByPlace(String placeName);

	CommentStatsRecord getCommentsStats(String placeName);

	void updateComm(CommentRecord comment, CommentRecord commentNew,
			String placeName, List<MultipartFile> images);

	void delete(CommentRecord comment, String placeName);
}