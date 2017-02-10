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

  describe('init', () => {
    it('should throw "Data is empty"', () => {
      const error = () => model.init();
      expect(error).to.throw('Data is empty');
    });

    it('should throw error containing "missing cats"', () => {
      const error = () => model.init({});
      expect(error).to.throw(/missing cats/);
    });
  });

  describe('getAllCats', () => {
    it('should return empty array if no cats', () => {
      model.init({cats: []});
      const cats = model.getAllCats();
      expect(cats).to.be.deep.equal([]);
    });

    it('should get all cats', () => {
      model.init(catData);
      const cats = model.getAllCats();

      expect(cats).to.be.deep.equal(catData.cats);
      expect(cats.length).to.be.equal(2);
    });
  });

  describe('getCatById', () => {
    model.init(catData);

    it('should get cat by passing catId', () => {
      const cat = model.getCatById(1);
      expect(cat).to.be.deep.equal(catData.cats[1]);
    });

    it('should return null if cat does not exist', () => {
      let cat = model.getCatById();
      expect(cat).to.be.null;

      cat = model.getCatById(3);
      expect(cat).to.be.null;
      
      cat = model.getCatById('kitty');
      expect(cat).to.be.null;
    });
  });

  describe('getCurrentCat', () => {
    model.init(catData);
    it('should get currentCat', () => {
      const cat = model.getCurrentCat();
      expect(cat).to.be.deep.equal(catData.cats[0]);
      expect(cat.name).to.be.equal('Spencer');
    });
  });

  describe('getCurrentCatId', () => {
    it('should get currentCat id', () => {
      const catId = model.getCurrentCatId();
      expect(catId).to.be.equal(0);
    });

    it('should throw exception if no currentCatId', () => {
      model.init({cats: []});
      const error = () => model.getCurrentCatId();
      expect(error).to.throw('No current cat id set');
    });
  });
  
  describe('setCatClickCount', () => {
    const cat = model.getAllCats()[0];

    it('should throw if NaN', () => {
      const error = () => app.model.setCatClickCount(cat, 'zero');
      expect(error).to.throw(Error);
    });

    it('should allow 0', () => {
      app.model.setCatClickCount(cat, 0);
      expect(cat.clickCount).to.be.equal(0);
    });
    
    it('should set clickCount to amount passed', () => { 
      app.model.setCatClickCount(cat, 1);
      expect(cat.clickCount).to.be.equal(1);

      app.model.setCatClickCount(cat, 2);
      expect(cat.clickCount).to.be.equal(2);

      app.model.setCatClickCount(cat, 3);
      expect(cat.clickCount).to.be.equal(3);
    });
  });

  describe('setCurrentCatId', () => {
    it('should create currentCat key if does not exist', () => {
      model.init({cats: [{}]});
      app.model.setCurrentCatId(0);
      expect(catData.currentCatId).to.be.equal(0);
    });

    it('should set currentCat', () => {
      model.init(catData);
      app.model.setCurrentCatId(1);
      expect(catData.currentCatId).to.be.equal(1);
    });

    it('should throw if catId is NaN', () => {
      const error = () => app.model.setCurrentCatId('two');
      expect(error).to.throw(Error);
    });

    it('should throw if cat does not exist', () => {
      const error = () => app.model.setCurrentCatId(3);
      expect(error).to.throw(Error);
    });
  });

  describe('updateCat', () => {
    it('should updateCat', () => {
      const catId = 0;
      let newCatData = {
        name: 'Spencer',
        clickCount: 2
      };
      model.updateCat(catId, newCatData);
      const update1 = model.getCatById(catId);
      expect(update1.name).to.be.equal('Spencer');
      expect(update1.clickCount).to.be.equal(2);

      newCatData = {
        name: 'Mr. Kittington',
        clickCount: 15
      };
      model.updateCat(catId, newCatData);
      const update2 = model.getCatById(catId);
      expect(update2.name).to.be.equal('Mr. Kittington');
      expect(update2.clickCount).to.be.equal(15);
    });
  });
})