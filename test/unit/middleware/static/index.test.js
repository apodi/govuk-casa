const proxyquire = require('proxyquire');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const { app } = require('../../helpers/express-mocks.js');

describe('Middleware: static/index', () => {
  let proxyStubs;
  let mwStatic;
  let mockApp;

  beforeEach(() => {
    proxyStubs = {
      './prepare-assets.js': sinon.stub(),
      './serve-assets.js': sinon.stub(),
      './asset-versions.js': sinon.stub(),
      fs: {
        accessSync: sinon.stub(),
      },
    };
    mwStatic = proxyquire('../../../../middleware/static/index.js', proxyStubs);

    mockApp = app();
  });

  describe('should throw an exception if the static assets directory is not accessible', () => {
    it('invalid directory', () => {
      proxyStubs.fs.accessSync = sinon.stub().throws(new Error());
      expect(() => {
        mwStatic({
          app: mockApp,
          compiledAssetsDir: 'test-dir',
        });
      }).to.throw(ReferenceError, 'Compiled static assets directory does not exist');
    });

    it('valid directory', () => {
      expect(() => {
        mwStatic({
          app: mockApp,
          compiledAssetsDir: 'test-dir',
        });
      }).to.not.throw();
    });
  });

  it('should set casaGovukFrontendVirtualUrl on express app', () => {
    mwStatic({
      app: mockApp,
      mountUrl: '/test-mount/',
      compiledAssetsDir: 'test-dir',
    });
    expect(mockApp.set).to.be.calledOnceWith('casaGovukFrontendVirtualUrl', '/test-mount/govuk/frontend');
  });

  it('should configure serving CASA assets on the correct url', () => {
    mwStatic({
      app: mockApp,
      mountUrl: '/test-mount/',
      compiledAssetsDir: 'test-dir',
    });
    expect(proxyStubs['./serve-assets.js']).to.be.calledOnceWith(sinon.match({
      prefixCasa: '/test-mount/govuk/casa',
    }));
  });

  it('should pass the correct npm packages for versioning', () => {
    mwStatic({
      app: mockApp,
      mountUrl: '/test-mount/',
      compiledAssetsDir: 'test-dir',
    });
    expect(proxyStubs['./asset-versions.js']).to.be.calledOnceWith(sinon.match.any, sinon.match((value) => {
      const keys = Object.keys(value);
      return keys.includes('casaMain') && keys.includes('govukFrontend') && keys.includes('govukTemplateJinja');
    }))
  });
});
