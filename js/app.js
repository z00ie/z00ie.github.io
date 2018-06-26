// Storage Controller
const StorageCtrl = (function() {
  // Public methods
  return {
    storeItem: item => {
      let items;
      // Check if any items in LS
      if (localStorage.getItem('items') === null) {
        items = [];
        // Push new item
        items.push(item);
        // Set LS
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // Get what is in LS
        items = JSON.parse(localStorage.getItem('items'));

        // Push new item
        items.push(item);

        // Reset LS
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: () => {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: updatedItem => {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      // Reset LS
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: id => {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach((item, index) => {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      // Reset LS
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: () => {
      localStorage.removeItem('items');
    }
  };
})();

// Item Controller
const ItemCtrl = (function() {
  class Item {
    constructor(id, name, calories, nowDate) {
      this.id = id;
      this.name = name;
      this.calories = calories;
      this.nowDate = nowDate;
    }
  }

  //  Data Structure / State
  const data = {
    /*
    Old hard coded data for testing
    items: [
      {
        id: 0,
        name: 'Turkey Sandwich',
        calories: 400
      },
      {
        id: 1,
        name: 'Steak Dinnner',
        calories: 1200
      },
      {
        id: 2,
        name: 'Ice Cream - Chacolate',
        calories: 200
      }
    ],
    */
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };

  // Public methods
  return {
    getItems: () => {
      return data.items;
    },
    addItem: (name, calories) => { 
      let ID;
      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      let dateOptions = {  
        weekday: "long", year: "numeric", month: "short",  
        day: "numeric", hour: "2-digit", minute: "2-digit"  
    };
      let = nowDate = new Date().toLocaleTimeString('en-US', dateOptions);

      // Parse calories to number
      calories = parseInt(calories);

      // Create new Item
      newItem = new Item(ID, name, calories, nowDate);

      // Add to items Array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: id => {
      let found = null;
      // Loop through items
      data.items.forEach(item => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: (name, calories) => {
      // Calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(item => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: id => {
      // Get ids
      const ids = data.items.map(item => {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: () => {
      data.items = [];
    },
    setCurrentItem: item => {
      data.currentItem = item;
    },
    getCurrentItem: () => {
      return data.currentItem;
    },
    getTotalCalories: () => {
      let total = 0;

      // Loop through items and add cals
      data.items.forEach(item => {
        total += item.calories;
      });

      // Set total cal in data structure
      data.totalCalories = total;

      // Return total
      return data.totalCalories;
    },
    logData: () => {
      return data;
    }
  };
})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    clearBtn: '.clear-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  };

  // Public methods
  return {
    populateItemList: items => {
      let html = '';

      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
        <small>${item.nowDate}: </small>
        <strong>${item.name}: </strong>
        <em>${item.calories} Calories</em>
        <a href="#" class="blue-text text-lighten-2 secondary-content">
          <i class="edit-item fas fa-pencil-alt fa-lg"></i>
        </a>
      </li>`;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: () => {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },
    addListItem: item => {
      // Show list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      //  Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `
      <small>${item.nowDate}</small>
      <strong>${item.name}: </strong>
      <em>${item.calories} Calories</em>
      <a href="#" class="blue-text text-lighten-2 secondary-content">
        <i class="edit-item fas fa-pencil-alt fa-lg"></i>
      </a>`;
      // Insert Item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement('beforeend', li);
    },
    updateListItem: item => {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn into nodelist array
      listItems = Array.from(listItems);

      listItems.forEach(listItem => {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
          <small>${item.nowDate}: </small>
          <strong>${item.name}: </strong>
          <em>${item.calories} Calories</em>
          <a href="#" class="blue-text text-lighten-2 secondary-content">
            <i class="edit-item fas fa-pencil-alt fa-lg"></i>
          </a>`;
        }
      });
    },
    deleteListItem: id => {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: () => {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: () => {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: () => {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn nodelist into array
      listItems = Array.from(listItems);

      listItems.forEach(item => {
        item.remove();
      });
    },
    hideList: () => {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: totalCalories => {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    clearEditState: () => {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: () => {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors: () => {
      return UISelectors;
    }
  };
})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // Load Event listeners
  const loadEventListeners = () => {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', itemAddSubmit);

    // Disable submit on enter hit
    document.addEventListener('keypress', e => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener('click', itemEditClick);

    // Update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener('click', itemUpdateSubmit);

    // Delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener('click', itemDeleteSubmit);

    // Clear all iteams event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener('click', clearAllItemsClick);

    // Back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener('click', UICtrl.clearEditState);
  };

  // Add item submit
  const itemAddSubmit = function(e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calories input
    if (input.name !== '' && input.calories !== '') {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total cal to UI
      UICtrl.showTotalCalories(totalCalories);

      //  Store in LS
      StorageCtrl.storeItem(newItem);

      // clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // Edit click icon
  const itemEditClick = function(e) {
    if (e.target.classList.contains('edit-item')) {
      // Get list item id
      const listId = e.target.parentNode.parentNode.id;

      // Break into array
      const listIdArr = listId.split('-');

      // Get the id
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  };

  // Edit Submit
  const itemUpdateSubmit = function(e) {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update LS
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Delete button event
  const itemDeleteSubmit = function(e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from LS
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Clear items event
  const clearAllItemsClick = function() {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Clear all from LS
    StorageCtrl.clearItemsFromStorage();

    // Remove from UI
    UICtrl.removeItems();

    // Hide UL
    UICtrl.hideList();
  };

  // Public methods
  return {
    init: () => {
      // Clear edit state
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list items
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total cal to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();
