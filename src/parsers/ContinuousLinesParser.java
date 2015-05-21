package parsers;

import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.Map;

import jebl.evolution.graphs.Node;
import jebl.evolution.trees.RootedTree;
import utils.Trait;
import utils.Utils;
import data.structure.Coordinate;
import data.structure.Line;

public class ContinuousLinesParser {

	public static final String START = "start";
	public static final String END = "end";
	public static final String ONE = "1";
	public static final String TWO = "2";

	public static final String DURATION = "duration";
	
	private RootedTree rootedTree;
	private String locationTrait;
	private String[] traits;
	
	public ContinuousLinesParser(RootedTree rootedTree, String locationTrait, String traits[]) {
		
		this.rootedTree = rootedTree;
		this.locationTrait = locationTrait;
		this.traits = traits;
		
	}//END: Constructor
	
	public LinkedList<Line> parseLines() {
		
		LinkedList<Line> linesList = new LinkedList<Line>();
		String latitudeName = locationTrait.concat(ONE);
		String longitudeName = locationTrait.concat(TWO);
		
		for (Node node : rootedTree.getNodes()) {
			if (!rootedTree.isRoot(node)) {

				Node parentNode = rootedTree.getParent(node);

				Double parentLongitude = (Double) Utils.getObjectNodeAttribute(
						parentNode, longitudeName);

				Double parentLatitude = (Double) Utils.getObjectNodeAttribute(
						parentNode, latitudeName);

				Double parentHeight = Utils.getNodeHeight(rootedTree, parentNode);

				Double nodeLongitude = (Double) Utils.getObjectNodeAttribute(node,
						longitudeName);

				Double nodeLatitude = (Double) Utils.getObjectNodeAttribute(node,
						latitudeName);

				Double nodeHeight = Utils.getNodeHeight(rootedTree, node);

				Coordinate parentCoordinate = new Coordinate(parentLatitude, parentLongitude);

				Coordinate nodeCoordinate = new Coordinate(nodeLatitude, nodeLongitude);

				Map<String, Trait> nodeAttributes = new LinkedHashMap<String, Trait>();
				for(String traitName : traits) {
					
					Object parentTraitObject = Utils.getObjectNodeAttribute( parentNode, traitName);
					Trait parentTrait = new Trait(parentTraitObject, parentHeight);
					
					nodeAttributes.put(START+traitName, parentTrait);
					
					Object nodeTraitObject = Utils.getObjectNodeAttribute( node, traitName);
					Trait nodeTrait = new Trait(nodeTraitObject, nodeHeight);
					
					nodeAttributes.put(END+traitName, nodeTrait);
					
				}//END: traits loop
				
				//TODO: branchAttributes specified from CLI
				
				Map<String, Trait> branchAttributes = new LinkedHashMap<String, Trait>();
				
				double branchDuration = parentHeight - nodeHeight;
				Trait branchDurationTrait = new Trait(branchDuration);
				branchAttributes.put(DURATION, branchDurationTrait);
				
				Line line = new Line(parentCoordinate, nodeCoordinate, parentHeight, nodeHeight, nodeAttributes, branchAttributes);
				linesList.add(line);

			}// END: root check
		}// END: nodes loop
		
		return linesList;
	}//END: parseLines
	
}//END: class