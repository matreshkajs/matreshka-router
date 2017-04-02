const Jasmine = require('jasmine');
const { jsdom } = require('jsdom');
const { SpecReporter } = require('jasmine-spec-reporter');

const jasmine = new Jasmine();

global.window = jsdom('<!doctype html><html><body></body></html>', {
    url: 'http://localhost'
}).defaultView;

jasmine.loadConfig({
    spec_dir: 'test/spec',
    spec_files: [
        '**/*_spec.js'
    ]
});

jasmine.addReporter(new SpecReporter());

jasmine.execute();
