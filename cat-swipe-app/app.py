from flask import Flask, jsonify, request, render_template
import requests

app = Flask(__name__)

CAT_API = "https://cataas.com/cat?json=true"

cats = []
liked_cats = []
current_index = 0


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/cats")
def get_cats():
    global cats, current_index, liked_cats
    cats = []
    liked_cats = []
    current_index = 0

    for _ in range(20):
        res = requests.get(CAT_API).json()
        cats.append("https://cataas.com" + res["url"])

    return jsonify(cats)


@app.route("/api/swipe", methods=["POST"])
def swipe():
    global current_index, liked_cats

    data = request.json
    direction = data["direction"]
    image_url = cats[current_index]

    if direction == "right":
        liked_cats.append(image_url)

    current_index += 1

    if current_index >= len(cats):
        return jsonify({
            "done": True,
            "likes": len(liked_cats),
            "liked_images": liked_cats
        })

    return jsonify({"done": False})


if __name__ == "__main__":
    app.run(debug=True)
