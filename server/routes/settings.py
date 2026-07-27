import json
import os

from flask import Blueprint, jsonify, request

settings = Blueprint("settings", __name__)

SETTINGS_FILE = "settings.json"

@settings.route("/settings", methods=["GET"])
def get_settings():

    if not os.path.exists(SETTINGS_FILE):
        return jsonify({})

    with open(SETTINGS_FILE, "r") as file:
        data = json.load(file)

    return jsonify(data)


@settings.route("/settings", methods=["PUT"])
def update_settings():

    data = request.json

    with open(SETTINGS_FILE, "w") as file:
        json.dump(data, file, indent=4)

    return jsonify({
        "message": "Settings updated successfully."
    })