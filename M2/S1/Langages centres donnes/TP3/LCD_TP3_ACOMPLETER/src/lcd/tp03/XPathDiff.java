package lcd.tp03;

import java.util.Vector;

import org.w3c.dom.Node;

class XPathDiff extends XPathExpr {


	XPathDiff () { super(2); };
	@Override
	Vector<Node> eval() {
		Vector<Node> set1 = arguments[0].eval();
		Vector<Node> set2 = arguments[1].eval();
		Vector<Node> res = new Vector<>();

		/****
		 * A COMPLETER : res doit contenir la différence des deux vecteurs set1 et set2 (qui sont triés dans l'ordre du document)
		 * Le numéro prefixe d'un nœud peut s'obtenir grace à
		 * Integer pre = (Integer) n.getUserData("preorder");
		 */
		int i = 0;
		int j = 0;
		while (i < set1.size() && j < set2.size()) {
			Node n1 = set1.get(i);
			Node n2 = set2.get(j);

			Integer pre1 = (Integer) n1.getUserData("preorder");
			Integer pre2 = (Integer) n2.getUserData("preorder");

			if (pre1.equals(pre2)) {
				i++;
				j++;
			} else if (pre1 < pre2) {
				res.add(n1);
				i++;
			} else {
				res.add(n2);
				j++;
			}

		}
		while (i < set1.size()) {
			Node n1 = set1.get(i);
			res.add(n1);
			i++;
		}
		while (j < set2.size()) {
			Node n2 = set2.get(j);
			res.add(n2);
			j++;
		}


		return res;
	}

	@Override
	String getLabel() {
		return "Diff";
	}

}
