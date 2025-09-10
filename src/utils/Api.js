class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl; // baseUrl is the warehouse location
    this._headers = headers; // headers are the access pass and package type
    // constructor body
  }

  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers, // Your access pass
    }).then((res) => {
      return this._checkResponse(res);
    });
  }

  addCard({ name, link }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      // Send the data in the body as a JSON string.
      body: JSON.stringify({
        name,
        link,
      }),
    }).then((res) => {
      return this._checkResponse(res);
    });
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers, // Your access pass
    }).then((res) => {
      return this._checkResponse(res);
    });
  }

  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      // Send the data in the body as a JSON string.
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => {
      this._checkResponse(res);
    });
  }

  editAvatarInfo({ avatar }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      // Send the data in the body as a JSON string.
      body: JSON.stringify({
        avatar,
      }),
    }).then((res) => {
      return this._checkResponse(res);
    });
  }

  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => {
      return this._checkResponse(res);
    });
  }

  likeStatus(isLiked, id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: this._headers,
    }).then((res) => {
      return this._checkResponse(res);
    });
  }
}

// other methods for working with the API

export default Api;

/**
 * Api Class Methods and Their Purposes:
 *
 * Method                          Purpose
 * ---------------------------------------------------------------------------
 * getAppInfo()                    Fetches both the initial cards and user info from the server.
 * getInitialCards()               Fetches the list of cards from the server.
 * addCard({ name, link })         Adds a new card to the server.
 * getUserInfo()                   Fetches the user’s profile information from the server.
 * editUserInfo({ name, about })   Updates the user’s profile information (name and about) on the server.
 * editAvatarInfo({ avatar })      Updates the user’s avatar on the server.
 */
