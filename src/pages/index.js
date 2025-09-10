import "./index.css";
import {
  enableValidation,
  hideInputError,
  settings,
  disableButton,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

// const initialCards = [
//   {
//     name: "Golden Gate Bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const cardSubmitBtn = editProfileModal.querySelector(".modal__save-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostSubmitBtn = newPostModal.querySelector(".modal__save-btn");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const cardImageInput = newPostModal.querySelector("#card-image-input");
const captionInput = newPostModal.querySelector("#caption-input");
const addCardFormElement = newPostModal.querySelector(".modal__form");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

const cardsList = document.querySelector(".cards__list");

const previewModal = document.querySelector("#preview-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn");

//avatar modal elements
const avatarModal = document.querySelector("#edit-avatar-modal"); // The avatar modal
const avatarModalForm = avatarModal.querySelector(".modal__form"); // The form inside the
const avatarUrlInput = avatarModal.querySelector("#profile-avatar-input"); // Input field for the avatar URL
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn"); // Close button
const avatarSubmitBtn = avatarModal.querySelector(".modal__save-btn"); // Submit button
const avatarModalBtn = document.querySelector(".profile__avatar-btn"); // The button to open the avatar modal

//delete modal elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalDeleteBtn = deleteModal.querySelector(".modal__delete-btn");
const deleteModalCancelBtn = deleteModal.querySelector(".modal__cancel-btn");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");

let selectedCard;
let selectedCardId;

const api = new Api({
  //When you create an instance, you’re hiring and configuring the delivery manager with all the details they need to do their job.
  baseUrl: "https://around-api.en.tripleten-services.com/v1", // Warehouse location
  headers: {
    authorization: "4d832038-c9b9-465f-a53f-daefc599cc12", // Your access pass
    "Content-Type": "application/json", // The type of packages you’re sending
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    console.log("User Info:", userInfo);

    // Destructure userInfo
    const { name, about, avatar } = userInfo;

    // Update profile info
    profileNameEl.textContent = name;
    profileDescriptionEl.textContent = about;

    console.log(avatar, "avatar data");
    profileAvatarEl.src = avatar;
    // "Manager, go fetch the cards from the warehouse.." //.then((cards) => { ... }): "When you return, I’ll process the cards."
    cards.forEach((cardData) => {
      //"For each card in the package, I’ll create and display it."
      const card = getCardElement(cardData); // Create a card from the data
      cardsList.appendChild(card); // Add the card to the display area, (cardsList)
    });
  })
  .catch(console.error);

addCardFormElement.addEventListener("submit", function (evt) {
  evt.preventDefault();

  newPostSubmitBtn.textContent = "Saving..."; // Change the button text to indicate saving

  // Get the card data from the form inputs
  const cardData = {
    name: captionInput.value, // Card title
    link: cardImageInput.value, // Card image URL
  };

  // Send the card data to the server
  api
    .addCard(cardData)
    .then((newCard) => {
      // Create the card element using the server's response
      const cardElement = getCardElement(newCard);
      cardsList.prepend(cardElement); // Add the card to the top of the list

      // Reset the form and close the modal
      addCardFormElement.reset();
      disableButton(newPostSubmitBtn, settings); // Disable the submit button
      closeModal(newPostModal);
    })
    .catch((err) => {
      console.error(err); // Log any errors
      alert("Failed to add the card. Please try again.");
    })
    .finally(() => {
      newPostSubmitBtn.textContent = "Save"; // Revert the button text back to original
    });
});

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  avatarSubmitBtn.textContent = "Saving...";
  api
    .editAvatarInfo({ avatar: avatarUrlInput.value }) // Correctly pass the avatar property
    .then((response) => {
      profileAvatarEl.src = response.avatar; // Update the avatar on the page
      disableButton(avatarSubmitBtn, settings); // Disable the submit button
      closeModal(avatarModal); // Close the modal
      avatarModalForm.reset(); // Reset the form
    })
    .catch(console.error)
    .finally(() => {
      avatarSubmitBtn.textContent = "Save"; // Revert the button text back to original
    }); // Handle errors
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;

  hideInputError(editProfileForm, editProfileNameInput, settings);
  hideInputError(editProfileForm, editProfileDescriptionInput, settings);
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  // editProfileModal.classList.remove("modal_is-opened");
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  // newPostModal.classList.add("modal_is-opened");
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  // newPostModal.classList.remove("modal_is-opened");
  closeModal(newPostModal);
});

function handleEditProfileFormSubmit(evt) {
  evt.preventDefault();

  cardSubmitBtn.textContent = "Saving..."; // Change button text to indicate saving
  console.log("Updating button text to 'Saving...'");

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((response) => {
      profileNameEl.textContent = response.name;
      profileDescriptionEl.textContent = response.about;
      disableButton(cardSubmitBtn, settings);
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      cardSubmitBtn.textContent = "Save"; // Revert button text back to original
    });
}

editProfileForm.addEventListener("submit", handleEditProfileFormSubmit);

function deleteSubmitHandler(evt) {
  evt.preventDefault();

  const deleteSubmitBtn = deleteForm.querySelector(".modal__save-btn");
  deleteSubmitBtn.textContent = "Deleting..."; // Change the button text to indicate deletion

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove(); // Remove the card from the DOM
      closeModal(deleteModal); // Close the delete confirmation modal
    })
    .catch((err) => {
      console.error(err); // Log any errors
      alert("Failed to delete the card. Please try again.");
    })
    .finally(() => {
      deleteSubmitBtn.textContent = "Delete"; // Revert the button text back to original
    });
}

function deleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleLikeButton(likeButton, cardId) {
  const isLiked = likeButton.classList.contains("card__like-btn_active"); // Check if the button is already liked

  if (isLiked) {
    // If the card is already liked, send a request to remove the like
    api
      .likeStatus(isLiked, cardId)
      .then(() => {
        likeButton.classList.remove("card__like-btn_active"); // Remove the active class
      })
      .catch((err) => {
        console.error("Error removing like:", err); // Log any errors
        alert("Failed to remove the like. Please try again.");
      });
  } else {
    // If the card is not liked, send a request to add the like
    api
      .likeStatus(isLiked, cardId)
      .then(() => {
        likeButton.classList.add("card__like-btn_active"); // Add the active class
      })
      .catch((err) => {
        console.error("Error adding like:", err); // Log any errors
        alert("Failed to add the like. Please try again.");
      });
  }
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  const cardId = data._id; // Extract the card ID

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  cardLikeBtn.addEventListener("click", () => {
    handleLikeButton(cardLikeBtn, cardId);
  });

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_active");
  }

  cardDeleteBtn.addEventListener("click", () => {
    openModal(deleteModal);
    deleteCard(cardElement, cardId);
  });

  cardImage.addEventListener("click", () => {
    previewImage.src = data.link;
    previewCaption.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

previewCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

editProfileModal.addEventListener("click", function (evt) {
  if (evt.target === editProfileModal) {
    closeModal(editProfileModal);
  }
});

newPostModal.addEventListener("click", function (evt) {
  if (evt.target === newPostModal) {
    closeModal(newPostModal);
  }
});

avatarModalBtn.addEventListener("click", function () {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", function () {
  closeModal(avatarModal);
});

avatarModalForm.addEventListener("submit", handleAvatarFormSubmit);

deleteForm.addEventListener("submit", deleteSubmitHandler);

// Close the delete modal when the close (X) button is clicked
deleteModalDeleteBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

// Close the delete modal when the cancel button is clicked
deleteModalCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

// Close the delete modal when clicking on the overlay
deleteModal.addEventListener("mousedown", (evt) => {
  if (evt.target === deleteModal) {
    closeModal(deleteModal);
  }
});

document.addEventListener("keydown", function (evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      evt.preventDefault();
      closeModal(openedModal);
    }
  }
});

previewModal.addEventListener("click", function (evt) {
  if (evt.target === previewModal) {
    closeModal(previewModal);
  }
});

enableValidation(settings);
