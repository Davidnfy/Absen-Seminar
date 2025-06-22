const absenStore = {
    getData: function() {
        return JSON.parse(localStorage.getItem('absenData')) || [];
    },

    saveData: function(data) {
        localStorage.setItem('absenData', JSON.stringify(data));
    },

    generateId: function(data) {
        return data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
    },

    addItem: function(item) {
        const data = this.getData();
        const newId = this.generateId(data);
        const newItem = { ...item, id: newId };
        data.push(newItem);
        this.saveData(data);
        return newItem;
    },

    updateItem: function(id, updatedItem) {
        const data = this.getData();
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index] = { ...updatedItem, id: id };
            this.saveData(data);
            return true;
        }
        return false;
    },

    deleteItem: function(id) {
        const data = this.getData();
        const newData = data.filter(item => item.id !== id);
        this.saveData(newData);
        return newData.length !== data.length;
    }
};
