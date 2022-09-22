class Searchable {
    constructor() {
        if (this === Searchable) {
            throw new Error("Can't instantiate abstract class!");
        }
    }


}

export default Searchable;