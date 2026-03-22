package com.skyroute.backend.comparators;

import java.util.Comparator;

import com.skyroute.backend.model.Comments;

/*This comparator was created to compare each comment and return a new Array List 
 * based on theirs dates
 */
public class CommentDateComparator implements Comparator<Comments>{
	public int compare(Comments c1, Comments c2) {
		return c2.getDate().compareTo(c1.getDate());
	}
}
