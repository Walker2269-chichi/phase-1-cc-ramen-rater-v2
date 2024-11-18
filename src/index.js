// Callbacks

const handleClick = (ramen) => {
  // Display ramen details
  const ramenDetail = document.getElementById("ramen-detail");
  ramenDetail.querySelector("img").src = ramen.image;
  ramenDetail.querySelector(".name").textContent = ramen.name;
  ramenDetail.querySelector(".restaurant").textContent = ramen.restaurant;

  // Update rating and comment
  document.getElementById("rating-display").textContent = ramen.rating;
  document.getElementById("comment-display").textContent = ramen.comment;

  // Attach the current ramen data to the edit form
  const editForm = document.getElementById("edit-ramen");
  editForm.dataset.ramenId = ramen.id;
  editForm["new-rating"].value = ramen.rating;
  editForm["new-comment"].value = ramen.comment;
};

const addSubmitListener = () => {
  const form = document.getElementById("new-ramen");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const newRamen = {
      name: form["new-name"].value,
      restaurant: form["new-restaurant"].value,
      image: form["new-image"].value,
      rating: form["new-rating"].value,
      comment: form["new-comment"].value,
    };

    addRamenToMenu(newRamen);

    // Persist the new ramen (POST request)
    fetch("http://localhost:3000/ramens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRamen),
    });

    form.reset(); // Clear the form after submission
  });
};

const addEditListener = () => {
  const editForm = document.getElementById("edit-ramen");
  editForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const ramenId = editForm.dataset.ramenId; // Get current ramen ID
    const updatedRamen = {
      rating: editForm["new-rating"].value,
      comment: editForm["new-comment"].value,
    };

    // Update the frontend
    document.getElementById("rating-display").textContent = updatedRamen.rating;
    document.getElementById("comment-display").textContent = updatedRamen.comment;

    // Persist changes (PATCH request)
    fetch(`http://localhost:3000/ramens/${ramenId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRamen),
    });
  });
};

const addRamenToMenu = (ramen) => {
  const ramenMenu = document.getElementById("ramen-menu");
  const img = document.createElement("img");
  img.src = ramen.image;
  img.addEventListener("click", () => handleClick(ramen));
  ramenMenu.appendChild(img);
};

const deleteRamen = (ramenId) => {
  const ramenMenu = document.getElementById("ramen-menu");
  const ramenDetail = document.getElementById("ramen-detail");

  // Remove ramen from menu
  const ramenImages = ramenMenu.querySelectorAll("img");
  ramenImages.forEach((img) => {
    if (img.src === ramenDetail.querySelector("img").src) {
      ramenMenu.removeChild(img);
    }
  });

  // Clear ramen details
  ramenDetail.querySelector("img").src = "";
  ramenDetail.querySelector(".name").textContent = "Select a ramen";
  ramenDetail.querySelector(".restaurant").textContent = "";
  document.getElementById("rating-display").textContent = "";
  document.getElementById("comment-display").textContent = "";

  // Persist the deletion (DELETE request)
  fetch(`http://localhost:3000/ramens/${ramenId}`, {
    method: "DELETE",
  });
};

const displayRamens = () => {
  fetch("http://localhost:3000/ramens")
    .then((response) => response.json())
    .then((data) => {
      const ramenMenu = document.getElementById("ramen-menu");
      data.forEach((ramen, index) => {
        addRamenToMenu(ramen);
        if (index === 0) handleClick(ramen); // Display the first ramen details
      });
    });
};

const main = () => {
  displayRamens(); // Load and display ramen images
  addSubmitListener(); // Attach form submission listener
  addEditListener(); // Attach edit form submission listener

  // Optional: Add delete button functionality
  const deleteButton = document.getElementById("delete-ramen");
  deleteButton.addEventListener("click", () => {
    const ramenId = document.getElementById("edit-ramen").dataset.ramenId;
    if (ramenId) deleteRamen(ramenId);
  });
};

document.addEventListener("DOMContentLoaded", main);

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};
