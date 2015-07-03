package parsers;

import org.joda.time.LocalDate;

import exceptions.AnalysisException;

import utils.Utils;

public class TimeParser {

	private String mrsd;
	private LocalDate endDate;

	public TimeParser(String mrsd) {

		this.mrsd = mrsd;

	}// END: Constructor

	public void parseTime() throws AnalysisException {

		Integer year = 0;
		Integer month = 0;
		Integer day = 0;
		
		String[] endDateFields;
		if(mrsd.contains(".")) {
			
			endDateFields = convertToYearMonthDay(Double.valueOf(mrsd));			
			
			year = Integer.valueOf(endDateFields[Utils.YEAR_INDEX]);
			month = Integer.valueOf(endDateFields[Utils.MONTH_INDEX]);
			day = Integer.valueOf(endDateFields[Utils.DAY_INDEX]);

			System.out.println("MRSD in a decimal date format and corresponds to: " + year +"-" + month + "-" + day);
			
		} else if(mrsd.contains("-")) {
			
			endDateFields = mrsd.split("-");
			if (endDateFields.length == 3) {

				year = Integer.valueOf(endDateFields[Utils.YEAR_INDEX]);
				month = Integer.valueOf(endDateFields[Utils.MONTH_INDEX]);
				day = Integer.valueOf(endDateFields[Utils.DAY_INDEX]);

			} else if (endDateFields.length == 2) {

				year = Integer.valueOf(endDateFields[Utils.YEAR_INDEX]);
				month = Integer.valueOf(endDateFields[Utils.MONTH_INDEX]);

			} else if (endDateFields.length == 1) {

				year = Integer.valueOf(endDateFields[Utils.YEAR_INDEX]);

			} else {
				throw new AnalysisException("Unrecognised date format " + this.mrsd);
			}
			
			System.out.println("MRSD is in a daytime format: " + year +"-" + month + "-" + day);
			
		} else {
			
			throw new AnalysisException("Unrecognised MRSD format " + this.mrsd);
			
		}//END: format check
		
		// joda monthOfYear must be [1,12] 
		if(month == 0) {
			month = 1;
		}

		// joda dayOfMonth must be [1,31] 
		if(day == 0) {
			day = 1;
		}

		this.endDate = new LocalDate(year, month, day);
	}// END: parseTime

	public String getNodeDate(double nodeHeight) {

		String[] fields = convertToYearMonthDay(nodeHeight);
		Integer years = Integer.valueOf(fields[Utils.YEAR_INDEX]);
		Integer months = Integer.valueOf(fields[Utils.MONTH_INDEX]);
		Integer days = Integer.valueOf(fields[Utils.DAY_INDEX]);
		LocalDate date = endDate.minusYears(years).minusMonths(months)
				.minusDays(days);
		String stringDate = date.toString();

		return stringDate;
	}// END: getNodeDate

	public String[] convertToYearMonthDay(double fractionalDate) {

		String[] yearMonthDay = new String[3];

		int year = (int) fractionalDate;
		String yearString;

		if (year < 10) {
			yearString = "000" + year;
		} else if (year < 100) {
			yearString = "00" + year;
		} else if (year < 1000) {
			yearString = "0" + year;
		} else {
			yearString = "" + year;
		}

		yearMonthDay[0] = yearString;

		double fractionalMonth = fractionalDate - year;

		int month = (int) (12.0 * fractionalMonth);
		String monthString;

		if (month < 10) {
			monthString = "0" + month;
		} else {
			monthString = "" + month;
		}

		yearMonthDay[1] = monthString;

		int day = (int) Math.round(30 * (12 * fractionalMonth - month));
		String dayString;

		if (day < 10) {
			dayString = "0" + day;
		} else {
			dayString = "" + day;
		}

		yearMonthDay[2] = dayString;

		return yearMonthDay;
	}// END: convertToYearMonthDay

}// END: class
