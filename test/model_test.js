const expect = require('chai').expect;
const app = require('../app');

describe('model', () => {
  const model = app.model;
  const catData = {
    currentCatId: 0,
    cats: [
      {
        name: 'Spencer',
        image: 'http://thecatapi.com/api/images/get.php?id=4e2',
        clickCount: null
      },
      {
        name: 'Fluffykins',
        image: 'http://thecatapi.com/api/images/get.php?id=7me',
        clickCount: 0
      }
    ]
  };

  describe('catExists', () => {
    it('should return true if cat exists', () =>  {
      const catCheck = model.catExists(1, catData);
      expect(catCheck).to.be.true;
    });

    it('should return false if cat does not exist', () =>  {
      const catCheck = model.catExists(4, catData);
      expect(catCheck).to.be.false;
    });
  });

  describe('getAllCats', () => {
    it('should return empty array if no cats', () => {
      const cats = model.getAllCats({});
      expect(cats).to.be.deep.equal([]);
    });

    it('should get all cats', () => {
      const cats = model.getAllCats(catData);
      expect(cats).to.be.deep.equal(catData.cats);
      expect(cats.length).to.be.equal(2);
    });
  });

  describe('getCatById', () => {
    it('should get cat by passing catId', () => {
      const cat = model.getCatById(1, catData);
      expect(cat).to.be.deep.equal(catData.cats[1]);
    });

    it('should return null if cat does not exist', () => {
      cat = model.getCatById(3, catData);
      expect(cat).to.be.null;
      
      cat = model.getCatById('kitty', catData);
      expect(cat).to.be.null;
    });
  });

  describe('getCurrentCat', () => {
    it('should get currentCat', () => {
      const cat = model.getCurrentCat(catData);
      const currentCat = catData.cats[0];
      expect(cat).to.be.deep.equal(currentCat);
      expect(cat.name).to.be.equal(currentCat.name);
    });
  });

  describe('getCurrentCatId', () => {
    it('should get currentCat id', () => {
      const catId = model.getCurrentCatId(catData);
      expect(catId).to.be.equal(0);
    });

    it('should throw exception if no currentCatId', () => {
      const error = () => model.getCurrentCatId({});
      expect(error).to.throw('No current cat id set');
    });
  });
  
  describe('setCatClickCount', () => {
    const cat = catData.cats[0];

    it('should throw if NaN', () => {
      const error = () => model.setCatClickCount(cat, 'zero');
      expect(error).to.throw('Click Count must be an Integer of 0 or greater');
    });

    it('should allow 0', () => {
      model.setCatClickCount(cat, 0);
      expect(cat.clickCount).to.be.equal(0);
    });
    
    it('should set clickCount to amount passed', () => { 
      model.setCatClickCount(cat, 1);
      expect(cat.clickCount).to.be.equal(1);

      model.setCatClickCount(cat, 2);
      expect(cat.clickCount).to.be.equal(2);

      model.setCatClickCount(cat, 3);
      expect(cat.clickCount).to.be.equal(3);
    });
  });

  describe('setCurrentCatId', () => {
    it('should create currentCat key if does not exist', () => {
      model.setCurrentCatId(0, catData);
      expect(catData.currentCatId).to.be.equal(0);
    });

    it('should set currentCat', () => {
      model.setCurrentCatId(1, catData);
      expect(catData.currentCatId).to.be.equal(1);
    });

    it('should throw if catId is NaN', () => {
      const error = () => model.setCurrentCatId('two', catData);
      expect(error).to.throw('Cat id must be a valid id');
    });

    it('should throw if cat does not exist', () => {
      const error = () => model.setCurrentCatId(3, catData);
      expect(error).to.throw('Cat id must be a valid id');
    });
  });

  describe('syncNewCatData', () => {
    let catData;
    const catId = 0;
    beforeEach(() => {
      catData = {
        currentCatId: 0,
        cats: [
          {
            name: 'Spencer',
            image: 'http://some-old-image.com',
            clickCount: 1
          },
          {
            name: 'Fluffykins',
            image: 'http://super-old-image.com',
            clickCount: 0
          }
        ]
      };
      model.setCurrentCatId(catId, catData);
    });

    it('should update cat data with new cat data', () => {
      let newCatData = {
        name: 'Stevie',
        image: 'http://neato-cat-images.com/',
        clickCount: 4
      };
      model.syncNewCatData(newCatData, catData);
      const updatedCat = model.getCatById(catId, catData);
      // name updated with new value
      expect(updatedCat.name).to.be.equal(newCatData.name);
      // image updated with new value
      expect(updatedCat.image).to.be.equal(newCatData.image);
      // clickCount updated with new value
      expect(updatedCat.clickCount).to.be.equal(4);
    });

    it('should only update cat data with matching data', () => {
      const catId = 0;
      model.setCurrentCatId(catId, catData);
      let newCatData = {
        name: 'Jones',
        tester: 4
      };
      model.syncNewCatData(newCatData, catData);
      const updatedCat = model.getCatById(catId, catData);
      // name updated with new value
      expect(updatedCat.name).to.be.equal(newCatData.name);
      // image left untouched
      expect(updatedCat.image).to.be.equal('http://some-old-image.com');
      // clickCount left untouched
      expect(updatedCat.clickCount).to.be.equal(1);
      // tester value ignored
    });

    describe('validateData', () => {
      it('should return false if no data', () => {
        const data = model.validateData();
        expect(data).to.be.false;
      });

      it('should return false if data is missing cats property', () => {
        const data = model.validateData({});
        expect(data).to.be.false;
      });

      it('should return data if data is valid', () => {
        const modelData = { cats: [] };
        const data = model.validateData(modelData);
        expect(data).to.be.deep.equal(modelData);
      });
    });
  });
  
})