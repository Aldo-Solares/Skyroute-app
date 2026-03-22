package com.skyroute.backend.comparators;
 
import java.util.Comparator;

import com.skyroute.backend.records.PlaceRecord;

/*
 * Another comparator but focused in places
 * */
public class PlaceNameComparator implements Comparator<PlaceRecord>{
	public int compare(PlaceRecord plR1,PlaceRecord plR2) {
		return plR1.name().compareTo(plR2.name());
	}
}