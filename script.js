
const eventList = document.getElementById("eventList");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const sortingSelect = document.getElementById("sorting");
const statusText = document.getElementById("status");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const pageInfo = document.getElementById("pageInfo");

let events = [];
let currentPage = 1;
const pageSize = 6;

// Fetch JSON data
async function loadEvents() {
    statusText.textContent = "Loading events...";

    try {
        const response = await fetch("events.json");

        if (!response.ok) {
            throw new Error("Unable to load event data");
        }

        events = await response.json();
        renderEvents();
    } catch (error) {
        statusText.textContent =
            "Error loading events. Please check your JSON file and server.";
        console.error(error);
    }
}

// Search, filter, sort and render events
function renderEvents() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categorySelect.value;
    const sorting = sortingSelect.value;

    let filteredEvents = events.filter(event => {
        const matchesSearch =
            event.name.toLowerCase().includes(searchText) ||
            event.location.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            event.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    filteredEvents.sort((a, b) => {
        if (sorting === "name") {
            return a.name.localeCompare(b.name);
        }

        if (sorting === "desc") {
            return b.date.localeCompare(a.date);
        }

        return a.date.localeCompare(b.date);
    });

    const totalPages = Math.ceil(filteredEvents.length / pageSize);

    if (totalPages > 0 && currentPage > totalPages) {
        currentPage = totalPages;
    }

    if (currentPage < 1) {
        currentPage = 1;
    }

    const startIndex = (currentPage - 1) * pageSize;

    const pageEvents = filteredEvents.slice(
        startIndex,
        startIndex + pageSize
    );

    eventList.innerHTML = "";

    if (pageEvents.length === 0) {
        statusText.textContent = "No events found.";
    } else {
        statusText.textContent =
            `Showing ${filteredEvents.length} matching event(s).`;

        pageEvents.forEach(event => {
            const card = document.createElement("article");
            card.className = "event-card";

            const title = document.createElement("h3");
            title.textContent = event.name;

            const category = document.createElement("span");
            category.className = "category";
            category.textContent = event.category;

            const date = document.createElement("p");
            date.textContent = `Date: ${event.date}`;

            const location = document.createElement("p");
            location.textContent = `Location: ${event.location}`;

            card.append(title, category, date, location);
            eventList.appendChild(card);
        });
    }

    pageInfo.textContent =
        `Page ${totalPages === 0 ? 0 : currentPage} of ${totalPages}`;

    previousButton.disabled = currentPage <= 1;
    nextButton.disabled =
        totalPages === 0 || currentPage >= totalPages;
}

// Search and filter events
searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderEvents();
});

categorySelect.addEventListener("change", () => {
    currentPage = 1;
    renderEvents();
});

// Sorting
sortingSelect.addEventListener("change", () => {
    currentPage = 1;
    renderEvents();
});

// Pagination
previousButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderEvents();
    }
});

nextButton.addEventListener("click", () => {
    currentPage++;
    renderEvents();
});

// Start application
loadEvents();
