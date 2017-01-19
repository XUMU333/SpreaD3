package app;

import java.util.Locale;

import utils.FortuneCookies;

public class SpreaD3 {

	public static final boolean DEBUG = true;

	public static final String SHORT_NAME = "SpreaD3";
	public static final String LONG_NAME = "Spatial Phylogenetic Reconstruction Of Evolutionary Dynamics";
	public static final String VERSION = "0.9.7rc";
	public static final String DATE_STRING = "2016";
	public static final String CODENAME = "";

	public static final String FILIP_BIELEJEC = "Filip Bielejec";
	public static final String GUY_BAELE = "Guy Baele";
	public static final String ANDREW_RAMBAUT = "Andrew Rambaut";
	public static final String MARC_SUCHARD = "Marc A. Suchard";
	public static final String PHILIPPE_LEMEY = "Philippe 'The Wise' Lemey";

	public static void main(String[] args) {

		Locale.setDefault(Locale.US);

		if (args.length > 0) {

			Spread3ConsoleApp cli = new Spread3ConsoleApp();
			welcomeDialog();
			cli.run(args);

		} else {

//			Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler());
			new Spread3UIApp();

		}

	}// END: main

	private static void welcomeDialog() {

		System.out.println();
		centreLine(SHORT_NAME + " version " + VERSION + " (" + DATE_STRING
				+ ")" + " -- " + CODENAME, 60);
		centreLine(LONG_NAME, 60);
		centreLine("Authors: " + FILIP_BIELEJEC + ", " + GUY_BAELE + ", "
				+ ANDREW_RAMBAUT + ", " + MARC_SUCHARD + " and "
				+ PHILIPPE_LEMEY, 60);
		centreLine("Thanks to: Stephan Nylinder " + "", 60);

		System.out.println();
		centreLine(FortuneCookies.nextCookie(), 60);
		System.out.println();

	}// END: welcomeDialog

	public static void centreLine(String line, int pageWidth) {
		int n = pageWidth - line.length();
		int n1 = n / 2;
		for (int i = 0; i < n1; i++) {
			System.out.print(" ");
		}
		System.out.println(line);
	}

}// END: class
