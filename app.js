// Storage Controller
const StorageCtrl = (function () {
	// Public methods
	return {
		storeItem: function (item) {
			let items;

			// Check if any items in LS
			if (localStorage.getItem('items') === null) {
				items = [];
				// Push newitem
				items.push(item);
				// Set LS
				localStorage.setItem('items', JSON.stringify(items));
			} else {
				items = JSON.parse(localStorage.getItem('items'));
				// Push new Item
				items.push(item);

				// Reset LS
				localStorage.setItem('items', JSON.stringify(items));
			}
		},
		getItemsFromStorage: function () {
			let items
			if (localStorage.getItem('items') === null) {
				items = [];
			} else {
				items = JSON.parse(localStorage.getItem('items'));
			}
			return items;
		},
		updateItemStorage: function (updatedItem) {
			let items = JSON.parse(localStorage.getItem('items'));

			items.forEach((item, index) => {
				if (updatedItem.id === item.id) {
					items.splice(index, 1, updatedItem);
				}
			});
			// Reset LS
			localStorage.setItem('items', JSON.stringify(items));
		},
		deleteItemFromStorage: function (id) {
			let items = JSON.parse(localStorage.getItem('items'));

			items.forEach((item, index) => {
				if (id === item.id) {
					items.splice(index, 1);
				}
			});
			// Reset LS
			localStorage.setItem('items', JSON.stringify(items));
		},
		clearItemsFromStorage: function() {
			localStorage.removeItem('items');
		}
	}
})();



// Item Controller
const ItemCtrl = (function () {
	// Item constructor
	const Item = function (id, name, calories) {
		this.id = id;
		this.name = name;
		this.calories = calories;
	};

	// Data Structure / State
	const data = {
		items: StorageCtrl.getItemsFromStorage(),
		currentItem: null,
		totalCalories: 0
	};

	// Public methods
	return {
		getItems: function () {
			return data.items
		},
		addItem: function (name, calories) {
			let ID;
			// Create ID
			if (data.items.length > 0) {
				ID = data.items[data.items.length - 1].id + 1;
			} else {
				ID = 0;
			}

			// Calories to nubmer
			calories = parseInt(calories);

			// create new Item
			newItem = new Item(ID, name, calories);

			// Add to items array
			data.items.push(newItem);

			return newItem;
		},
		getItemById: function (id) {
			let found = null;

			// Loop through items
			data.items.forEach(item => {
				if (item.id === id) {
					found = item;
				}
			})
			return found;
		},
		updateItem: function (name, calories) {
			// Calories to number
			calories = parseInt(calories);

			let found = null;

			data.items.forEach(item => {
				if (item.id === data.currentItem.id) {
					item.name = name;
					item.calories = calories;
					found = item
				}
			})

			return found;
		},
		deleteItem: function (id) {
			// Get ids
			const ids = data.items.map((item) => {
				return item.id;
			});

			// Get index
			const index = ids.indexOf(id);

			// Remove item
			data.items.splice(index, 1);
		},
		setCurrentItem: function (item) {
			data.currentItem = item;
		},
		getCurrentItem: function () {
			return data.currentItem;
		},
		clearAllItems: function () {
			data.items = [];
		},
		getTotalCalories: function () {
			let total = 0;

			data.items.forEach(item => {
				total += item.calories;
			})

			// Set total cal in data structure
			data.totalCalories = total;

			return data.totalCalories;
		},
		logData: function () {
			return data;
		}
	};
})();


// UI Controller
const UICtrl = (function () {
	const UISelectors = {
		itemList: '#item-list',
		addBtn: '.add-btn',
		itemNameInput: '#item-name',
		itemCaloriesInput: '#item-calories',
		totalCalories: '.total-calories',
		updateBtn: '.update-btn',
		deleteBtn: '.delete-btn',
		backBtn: '.back-btn',
		clearBtn: '.clear-btn',
		listItems: '#item-list li'
	}

	// Public methods
	return {
		populateItemList: function (items) {
			let html = '';
			items.forEach(item => {
				html += `
				<li class="collection-item" id="item-${item.id}">
			   	<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
			   	<a href="#" class="secondary-content">
			      	<i class="edit-item fa fa-pencil"></i>
			   	</a>
			  </li>
				`;
			});

			console.log('populateItemList!');

			// Insert List items
			document.querySelector(UISelectors.itemList).innerHTML = html;
		},
		getItemInput: function () {
			return {
				name: document.querySelector(UISelectors.itemNameInput).value,
				calories: document.querySelector(UISelectors.itemCaloriesInput).value
			}
		},
		addListItem: function (item) {
			// Create li element
			const li = document.createElement('li');

			// Add class
			li.className = 'collection-item';
			// add ID
			li.id = `item-${item.id}`

			//Add HTML
			li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
			<a href="#" class="secondary-content">
				<i class="edit-item fa fa-pencil"></i>
			</a>`;

			console.log('hi!');


			// Insert Item
			document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
		},
		clearInput: function () {
			document.querySelector(UISelectors.itemNameInput).value = '';
			document.querySelector(UISelectors.itemCaloriesInput).value = '';
		},
		addItemToForm: function () {
			document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
			document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
			UICtrl.showEditState();
		},
		updateLisItem: function (item) {
			let listItems = document.querySelectorAll(UISelectors.listItems);

			// Turn Node list into array
			listItems = Array.from(listItems);

			listItems.forEach(listItem => {
				const itemID = listItem.getAttribute('id');

				if (itemID === `item-${item.id}`) {
					document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
					<a href="#" class="secondary-content">
						<i class="edit-item fa fa-pencil"></i>
					</a>`;
				}
			})
		},
		getSelectors: function () {
			return UISelectors;
		},
		removeItems: function () {
			let listItems = document.querySelectorAll(UISelectors.listItems);

			// Turn Node list into array
			listItems = Array.from(listItems);

			listItems.forEach(item => {
				item.remove();
			})
		},
		deleteListItem: function (id) {
			const itemID = `#item-${id}`;
			const item = document.querySelector(itemID);
			item.remove();
		},
		clearEditState: function () {
			UICtrl.clearInput();

			document.querySelector(UISelectors.updateBtn).style.display = 'none';
			document.querySelector(UISelectors.deleteBtn).style.display = 'none';
			document.querySelector(UISelectors.backBtn).style.display = 'none';
			document.querySelector(UISelectors.addBtn).style.display = 'inline';
		},
		showEditState: function () {
			document.querySelector(UISelectors.updateBtn).style.display = 'inline';
			document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
			document.querySelector(UISelectors.backBtn).style.display = 'inline';
			document.querySelector(UISelectors.addBtn).style.display = 'none';
		},
		showTotalCalories: function (totalCalories) {
			document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
		}
	}
})();


// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
	//  Load even listeners
	const loadEventListeners = function () {

		// Get UI Selectors
		const UISelectors = UICtrl.getSelectors();

		// Add item event
		document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

		// DIsable submit on enter
		document.addEventListener('keypress', function (e) {
			if (e.keyCode === 13 || e.which === 13) {
				e.preventDefault();
				return false;
			}
		})

		// Edit icon click event
		document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

		// Update item event
		document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

		// Back button event
		document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

		// DeLete
		document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

		// Clear all items
		document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
	}

	const itemAddSubmit = function (e) {
		e.preventDefault();

		// get form input from UI Controller
		const input = UICtrl.getItemInput();

		if (input.name.trim() && input.calories.trim()) {
			// Add item
			const newItem = ItemCtrl.addItem(input.name, input.calories);

			// Add Item to UI list
			UICtrl.addListItem(newItem);

			// Get total calories
			const totalCalories = ItemCtrl.getTotalCalories();

			// Add total cal to the UI
			UICtrl.showTotalCalories(totalCalories);

			// Store in localStorage
			StorageCtrl.storeItem(newItem);

			// Clear fields
			UICtrl.clearInput();

		}
	}
	// Update item submit
	const itemEditClick = function (e) {

		if (e.target.classList.contains('edit-item')) {

			// Get the list item ID
			const listId = e.target.parentNode.parentNode.id;

			// Break into an array
			const listIdArr = listId.split('-');

			// Get the actual id
			const id = parseInt(listIdArr[1]);

			// Get Item
			const itemToEdit = ItemCtrl.getItemById(id);

			// setcurrent item
			ItemCtrl.setCurrentItem(itemToEdit);

			// Add item to form
			UICtrl.addItemToForm();

		}
		e.preventDefault();
	}

	// Update edit submit
	const itemUpdateSubmit = function (e) {
		e.preventDefault();

		const input = UICtrl.getItemInput();

		// Update item
		const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

		// update ui
		UICtrl.updateLisItem(updatedItem);

		// Get total calories
		const totalCalories = ItemCtrl.getTotalCalories();

		// Add total cal to the UI
		UICtrl.showTotalCalories(totalCalories);

		// Update LS
		StorageCtrl.updateItemStorage(updatedItem);

		UICtrl.clearEditState();
	}

	// Delete button event
	const itemDeleteSubmit = function (e) {
		e.preventDefault();

		// Get current item
		const currentItem = ItemCtrl.getCurrentItem();

		// Delete from data structure
		ItemCtrl.deleteItem(currentItem.id);

		// Delete from UI
		UICtrl.deleteListItem(currentItem.id);

		// Get total calories
		const totalCalories = ItemCtrl.getTotalCalories();

		// Add total cal to the UI
		UICtrl.showTotalCalories(totalCalories);

		// Delete from LS
		StorageCtrl.deleteItemFromStorage(currentItem.id);

		UICtrl.clearEditState();
	}

	// Clear items event
	const clearAllItemsClick = function () {
		// Delete all items from data structure
		ItemCtrl.clearAllItems();

		// Get total calories
		const totalCalories = ItemCtrl.getTotalCalories();

		// Add total cal to the UI
		UICtrl.showTotalCalories(totalCalories);

		//Clear from local storage
		StorageCtrl.clearItemsFromStorage();

		// Remove from the UI
		UICtrl.removeItems();


	}




	// Public methods
	return {
		init: function () {
			// Clear edit state / set initial state
			UICtrl.clearEditState();

			// Fetch items from data structire
			const items = ItemCtrl.getItems();

			// Populate list with Items
			UICtrl.populateItemList(items);

			// Get total calories
			const totalCalories = ItemCtrl.getTotalCalories();

			// Add total cal to the UI
			UICtrl.showTotalCalories(totalCalories);

			// Load Event listeners
			loadEventListeners();

		}
	};
})(ItemCtrl, StorageCtrl, UICtrl);



// Initialize App
App.init();