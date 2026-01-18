from flask import Flask, jsonify, request, render_template
import requests

app = Flask(__name__)

CAT_API = "https://cataas.com/cat/"

CAT_IDS = ['Se34Weydwsj8E23d','xDZNx31tiOBRJsvl','MmClMm0gXCiDB9a7','wlbEPnWUQi9e0F1X','T7B1GKurXhK69ZSj',
        'IPBAWtXAdx6nFqi0','7FJaGUdoeOoWhxMr','QCBGV9dw9Q2grxKn','NWO1DbHLf2RgndBg','AkrHfbXEQ0pRulCZ',
        'KfrMXbLWJc7arB5C','X1NtUlYSXELBkZmy','0M0Lo3dsYft79xNd','1KCTvPEcpY7ryO34','BYtyLnxQbP3N2jyc',
        'o9UjyHopJE4x1Edk','xk5oZn0fNpfD5J1Q','w93PD5D7ZOsRaGrr','IpIiFVhf7wfEsKQv','zFwaTNvqPW6jHafk']
cats = []
liked_cats = []
current_index = 0

@app.route("/api/cats")
def get_cats():
    # Build full URLs from IDs
    cats = [{"id": cat_id, "url": f"https://cataas.com/cat/{cat_id}?position=center"} for cat_id in CAT_IDS]
    return jsonify(cats)


@app.route("/api/swipe", methods=["POST"])
def swipe():
    global current_index, liked_cats, cats

    data = request.json
    direction = data["direction"]

    current_cat = cats[current_index]

    # Save liked cats correctly
    if direction == "right":
        liked_cats.append(current_cat)  # or current_cat['id'] if you only want ID

    current_index += 1

    if current_index >= len(cats):
        return jsonify({
            "done": True,
            "likes": len(liked_cats),
            "liked": liked_cats
        })

    return jsonify({"done": False, "index": current_index})



if __name__ == "__main__":
    app.run(debug=True)
