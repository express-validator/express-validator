## Change Log

### v2.20.1 2016/03/13
- [0f4d5f6](https://github.com/ctavan/express-validator/commit/0f4d5f69d514c691f33890698cdea37060a1698c) Upgrade to 2.20.1 (@rustybailey)
- [0241908](https://github.com/ctavan/express-validator/commit/0241908c15684333cce7102d8a882718f09d387c) Downgrade validator. An upgrade will require a major version bump since it doesn't automatically coerce non-strings to strings anymore: https://github.com/chriso/validator.js/pull/496 (@rustybailey)

### v2.20.0 2016/03/13
- [e57acd2](https://github.com/ctavan/express-validator/commit/e57acd209e795b2dbfee43fb7aa126da9738b23d) Upgrade to 2.20.0 (@rustybailey)
- [9073b5e](https://github.com/ctavan/express-validator/commit/9073b5e53c122bd60f9873818980b87dde177b28) Upgrade github-changes, lodash, and validator; update CHANGELOG. (@rustybailey)
- [dca9911](https://github.com/ctavan/express-validator/commit/dca9911928dba20dbd3fa31f39260b7f18da22f0) Apply README fixes from 9b74fb4ffd4edce7268b9d1e9303829cdb8ae14e (@rustybailey)
- [c704a22](https://github.com/ctavan/express-validator/commit/c704a2203f430dacff765e83862e36e1cc45471d) Upgrade to 2.19.2
- [9b74fb4](https://github.com/ctavan/express-validator/commit/9b74fb4ffd4edce7268b9d1e9303829cdb8ae14e) Fix matches example in README (resolves #209)
- [20f033a](https://github.com/ctavan/express-validator/commit/20f033a9f6a7ba6ad1f3d9eb6c34e8e804071d0a) Added missing require that broke build of tests on node v0.10.43
- [981239f](https://github.com/ctavan/express-validator/commit/981239fd7d7841b2c862c28e1d3f92836f52dcaa) Readme and tests updated after review.
- [f6f88bc](https://github.com/ctavan/express-validator/commit/f6f88bcfd69179f2fdae87c02903bc04eba92029) #203 - Fixed bug where .withMessage() would not apply to a custom async validator (@chrissinclair)
- [4fdc7a9](https://github.com/ctavan/express-validator/commit/4fdc7a9a711485e792886accdc9160725ad67d9b) Extended test schema to check if not supported location type force validator to skip.
- [d1894e8](https://github.com/ctavan/express-validator/commit/d1894e88a15f5a135aaf6090e9a771eff0bbee48) Formatter updated.
- [d87a4f1](https://github.com/ctavan/express-validator/commit/d87a4f1a06b98ef466513decec6428fef3d3c6d6) Readme updated.
- [a300751](https://github.com/ctavan/express-validator/commit/a30075162b721c5cdb3c2dee196704aab3d30f5b) Issue #206. Added support for new field in validators structure allowing to define location of validation.

### v2.19.1 2016/02/05
- [f3ed152](https://github.com/ctavan/express-validator/commit/f3ed152ef28bcc49d7c67c3842fb1ff1bb2067ed) 2.19.1 (@rustybailey)
- [64d34f7](https://github.com/ctavan/express-validator/commit/64d34f736b2b0d0880a5ca0c55fff8296422cf73) Update package.json (@timoruppell)
- [55ad066](https://github.com/ctavan/express-validator/commit/55ad06654b65ffd2d7ecdc7f33de80b6856f7340) Change lodash method names to match 4.x changes (@timoruppell)

### v2.19.0 2016/01/21
- [479dc71](https://github.com/ctavan/express-validator/commit/479dc71c78e73d0e525b8111c7672c524564b60e) 2.19.0
- [460e11c](https://github.com/ctavan/express-validator/commit/460e11c6df1210d66abd96cd3d2593c429528edf) Upgrade dependency (validator.js) from 4.2.x -> 4.5.x (@aristidesfl)

### v2.18.0 2015/10/28
- [8a2cb3b](https://github.com/ctavan/express-validator/commit/8a2cb3bd75fadb49cb861e08d2f5c3db1d9693bf) Upgrade to 2.18.0 (@rustybailey)
- [4c9359f](https://github.com/ctavan/express-validator/commit/4c9359f3062241535991bad6411f3ed2a658bff7) Fix #177: Add sanitizeHeaders with tests and docs. (@rustybailey)
- [3e636f3](https://github.com/ctavan/express-validator/commit/3e636f36a84d0defd7d644b1ef5d697811755be5) Fix #120: Add an options object to optional() so that you can test for falsy values. (@rustybailey)
- [56d18fb](https://github.com/ctavan/express-validator/commit/56d18fb5dc675502d06d57a377259e173d29d6fa) Update validator to 4.2.x and add node 4.0/4.1 to travis.yml. (@rustybailey)
- [3123c0f](https://github.com/ctavan/express-validator/commit/3123c0f41bdaeced65deeb672c0955359571fa93) Fix #182: Add how to call validators/sanitizers with arguments to docs. (@rustybailey)
- [dc9a576](https://github.com/ctavan/express-validator/commit/dc9a5763b4378ee56f1b4f49b3d88c5044f8fdf6) Update readme (@riguy724)

### v2.17.1 2015/08/28
- [94f5c11](https://github.com/ctavan/express-validator/commit/94f5c11065d800c0a027fb0b2c52914e8dafaec7) Upgrade to 2.17.1. (@rustybailey)
- [13083d9](https://github.com/ctavan/express-validator/commit/13083d90bec06b0f7b9dbb6bff5986e7fd1735eb) Clarify mappedErrors in README - resolves #161 (@rustybailey)
- [eef5347](https://github.com/ctavan/express-validator/commit/eef534782067bf19b459120a5770ed186fbe6917) Issue #165: Fix the output of nested params to be a uniform string in the param field. This was broken in the refactor of v2.12.0. (@rustybailey)
- [979cd33](https://github.com/ctavan/express-validator/commit/979cd33b3c8d13923f93573f63a85cd88f9d0d27) Update README.md (@rustybailey)

### v2.17.0 2015/08/27
- [ba73177](https://github.com/ctavan/express-validator/commit/ba73177ec176363ef25566a5241bfc4331ccd5ae) Upgrade to 2.17.0 (@rustybailey)
- [bf54ca8](https://github.com/ctavan/express-validator/commit/bf54ca8252c4cb358a2ef0823abf41b70c02fab8) Typo fix. (@rustybailey)

### v2.16.0 2015/08/26
- [09f2225](https://github.com/ctavan/express-validator/commit/09f2225a8d7101bab3f149d4d04f94e878df709f) Upgrade to 2.16.0. (@rustybailey)
- [b7d98ec](https://github.com/ctavan/express-validator/commit/b7d98ec7a933c2cd4a1cda8cdfa2f3918075c609) Fix typos in comments. (@rustybailey)
- [6e13c90](https://github.com/ctavan/express-validator/commit/6e13c901bf5e0dea5b0085b1366c9a6c6dae9956) async validation (@Jakeii)
- [b6fca2b](https://github.com/ctavan/express-validator/commit/b6fca2b3a2d0d215f1ae620301977c0c6a0ccb6b) change failMsg to errorMessage, use optional in README.md example (@Jakeii)
- [8ff3698](https://github.com/ctavan/express-validator/commit/8ff36987ce13476fad5dbb5653612860ecf0aca3) conform to jscs and other imporvements (@Jakeii)

### v2.15.1 2015/08/19
- [a5e8906](https://github.com/ctavan/express-validator/commit/a5e89062d2e33ed09345ccb6dcec83e61e4cdefb) Upgrade to 2.15.1 (@rustybailey)
- [b9dc9df](https://github.com/ctavan/express-validator/commit/b9dc9dfee7408d37319b138ff33a06e688c2b36c) Fixed bug where with message would provide a custom message to an incorrect validation if the one it was meant to apply to passed, but a validation with a default message failed before hand.

### v2.15.0 2015/08/17
- [1ffb3d4](https://github.com/ctavan/express-validator/commit/1ffb3d4ce6622ca4e0b415df32fc11540f1b434e) Upgrade to 2.15.0 (@rustybailey)
- [a16ea13](https://github.com/ctavan/express-validator/commit/a16ea13f968ab6de058e161a6cd7368ff036c6b2) Correct sanitize example in README. (@rustybailey)
- [bf5edfa](https://github.com/ctavan/express-validator/commit/bf5edfaaf9e2ff7f420600116cb9a63dea1de807) Updated a few style points per PR feedback. (@chrissinclair)
- [10a15a2](https://github.com/ctavan/express-validator/commit/10a15a22ed3da0d730b958b0699e01e2f7abe883) Updated readme to detail the .withMessage method (@chrissinclair)
- [9b4243c](https://github.com/ctavan/express-validator/commit/9b4243cbd96c34af77a0570ab752942c6ca8f58f) Added withMessage extension to provide a custom message per validation (@chrissinclair)

### v2.14.2 2015/08/11
- [42bcf60](https://github.com/ctavan/express-validator/commit/42bcf60b81372dd6c0cb7451ebc8276867dccba1) Upgrade to 2.14.2 (@rustybailey)
- [8807999](https://github.com/ctavan/express-validator/commit/88079994627ece8559c03a6adf5150e9dd79bf6d) Fixed typo with the direction of how to use custom sanitizer. (@phuson)

### v2.14.1 2015/08/10
- [84e489f](https://github.com/ctavan/express-validator/commit/84e489fd1a8d63eec6483a5511681ec767412ffe) Upgrade to 2.14.1 (@rustybailey)
- [669fcb8](https://github.com/ctavan/express-validator/commit/669fcb8c177c4f86c1fe3c357537e622bc60ae46) Add sudo false to travis to move to container builds: http://docs.travis-ci.com/user/workers/container-based-infrastructure/ (@rustybailey)
- [b6c89ef](https://github.com/ctavan/express-validator/commit/b6c89ef88f7cf7b20cc7e5e807a7066aa8fa791e) Don't call validators for optional parameters (@ikokostya)

### v2.14.0 2015/08/05
- [478f36d](https://github.com/ctavan/express-validator/commit/478f36d66b0fafbd105c4e4f71b63db9bb5d9a5e) Upgrade to 2.14.0 (@rustybailey)
- [60bfdcb](https://github.com/ctavan/express-validator/commit/60bfdcb4991f7a7afb73704e74ad426d1fbf6db2) Change lodash version to 3.10.x and validator version to 4.0.x (@rustybailey)
- [3e5ca70](https://github.com/ctavan/express-validator/commit/3e5ca7003cd2ab7eaa3d88083d589fc94f8e78f7) Updated to the latest validator version (4.0.2) (@SamVerschueren)

### v2.13.0 2015/06/30
- [0b02b1b](https://github.com/ctavan/express-validator/commit/0b02b1b000241914205a9c72e4e9f291b792dd52) Upgrade to 2.13.0 (@rustybailey)
- [879c41d](https://github.com/ctavan/express-validator/commit/879c41da7552e77748fb3a5dc0c347ad498a5952) Update lodash to 3.10.0 (@rustybailey)

### v2.12.2 2015/06/27
- [8e754ba](https://github.com/ctavan/express-validator/commit/8e754ba78a7ea9b85f3fdc1be182970f010d823c) Upgrade to 2.12.2 (@rustybailey)
- [cd7f31b](https://github.com/ctavan/express-validator/commit/cd7f31bf783597313b225960407a8ee754a34d24) Test for falsey values in sanitization. (@rustybailey)
- [72d06e8](https://github.com/ctavan/express-validator/commit/72d06e8a105df00cb98333c5009845498a260045) Add jscsrc, add jscs/jshint to travis build, and fix errors thrown by JSHint/JSCS. (@rustybailey)
- [d1c5ec3](https://github.com/ctavan/express-validator/commit/d1c5ec3f35078b2986cbb83ec3977f031c08a2c1) build a chain so optional works (@Jakeii)
- [586d65d](https://github.com/ctavan/express-validator/commit/586d65d7a839710ffb3fcf428aff54b2babe327b) add validation by schema (@Jakeii)

### v2.12.1 2015/06/16
- [eeeb52f](https://github.com/ctavan/express-validator/commit/eeeb52fcdfd320a6a97161ddfd2b6abb60e6d153) Upgrade to 2.12.1 (@rustybailey)
- [006ab99](https://github.com/ctavan/express-validator/commit/006ab9927d6519b2594ebc5c841a83584433aed1) Provide a default options value (@JSteunou)

### v2.12.0 2015/06/16
- [cf8427b](https://github.com/ctavan/express-validator/commit/cf8427bc8f9325bab80c538084dc415ae39d5f08) Upgrade to 2.12.0 (@rustybailey)
- [261337a](https://github.com/ctavan/express-validator/commit/261337a8a479b806f66f2cb2a819c748a53568ec) Update node-validator to 3.40.1 (@rustybailey)
- [fc2745e](https://github.com/ctavan/express-validator/commit/fc2745e3a2b122e324f8e582b7a0544e071db97d) complete code refactor (@Jakeii)

### v2.11.0 2015/06/01
- [63ac9c8](https://github.com/ctavan/express-validator/commit/63ac9c84f4e54fd215e8e9a00ae92e772ba65774) Bump to 2.11.0 (@rustybailey)
- [e92aa7f](https://github.com/ctavan/express-validator/commit/e92aa7f0aad74a11f8359b3e588ccdfadaac16df) fix readme, add tests (@uhlryk)
- [a7352f7](https://github.com/ctavan/express-validator/commit/a7352f71579ca34fd5febb6d20f86efae3169023) fix spelling sanitize; add documentation (@uhlryk)
- [cdf3a0e](https://github.com/ctavan/express-validator/commit/cdf3a0e7682ce7c32d6a8692e2bd6fb7671de5da) added custom santizers (@uhlryk)
- [06435b9](https://github.com/ctavan/express-validator/commit/06435b97d1310f6de72c6428b4281c0932ecbf5f) Update CHANGELOG.md (changelog command relies on remote tags) (@rustybailey)
- [ea00f9d](https://github.com/ctavan/express-validator/commit/ea00f9d6cfe0859f6f00ceb45d66f4d9270064b0) Update changelog. (@rustybailey)

### v2.10.0 2015/05/04
- [0f48735](https://github.com/ctavan/express-validator/commit/0f48735dc77ec561ad014a721375b561ce3889fe) 2.10.0 (@rustybailey)
- [bc2ef59](https://github.com/ctavan/express-validator/commit/bc2ef59b5a5c45be12f6efb27199a29d8689ac2f) Use the same node versions as node-validator. (@rustybailey)
- [0c3aaec](https://github.com/ctavan/express-validator/commit/0c3aaecb0f7d4a75a1bc20e94290cfe72e98a49c) Bump validator version to 3.39.0 (@rustybailey)
- [dfb757b](https://github.com/ctavan/express-validator/commit/dfb757b8eafe3149c552be4b92eb259fb6bdd5e5) Add changelog to devDependencies and add npm script to generate changelog. (@rustybailey)
- [bf044b5](https://github.com/ctavan/express-validator/commit/bf044b577f6999a7f1e92cb9f74ddf4a44bd78d3) Add node 0.12 to travis.yml, remove dead gist link in README, add license in package.json. (@rustybailey)
- [f42077f](https://github.com/ctavan/express-validator/commit/f42077fabfc9b8ef6100069b17e83f5fab2eb395) Add editorconfig. (@rustybailey)
- [73daa44](https://github.com/ctavan/express-validator/commit/73daa44dee192049da4fff732dec629a6630af73) Add jshint to devDependencies, add .jshintrc, fix semicolon issues. (@rustybailey)
- [fb8d049](https://github.com/ctavan/express-validator/commit/fb8d049dd1f0a0da6c0070cf160316f9b732a732) Add comment to explain before() function busting require's cache in each test file. (@rustybailey)
- [7fc7b1c](https://github.com/ctavan/express-validator/commit/7fc7b1c54c22f19dfc650cba06b47e6e05d0c653) Remove async from devDependencies (@rustybailey)
- [a74de1e](https://github.com/ctavan/express-validator/commit/a74de1eb3ef2bdf67beb5be4fd3a8e51e4d190b5) Remove old tests and change npm test to use Mocha. (@rustybailey)
- [39f1b55](https://github.com/ctavan/express-validator/commit/39f1b55f817a7ca1f0fc802247ba8dd0d24ff21f) Add Mocha tests for validating regex routes (@rustybailey)
- [68adc6e](https://github.com/ctavan/express-validator/commit/68adc6e76b6abb3f0c1946c3c51ca16c1cebe9b6) Add Mocha tests for nested input (@rustybailey)
- [a029176](https://github.com/ctavan/express-validator/commit/a029176a7c7ac0666f0b93adca0d2ea0a57ff98b) Add Mocha tests for mapped output using validationErrors(true) (@rustybailey)
- [5a2f7ef](https://github.com/ctavan/express-validator/commit/5a2f7ef3a5a0f59fb9f6692e2e5d93f81b5e497b) Add Mocha tests for check() (@rustybailey)
- [9cd6f62](https://github.com/ctavan/express-validator/commit/9cd6f626cb287f1a877e0f645690b528938f3dc4) Add Mocha tests for checkQuery() (@rustybailey)
- [c91e022](https://github.com/ctavan/express-validator/commit/c91e0220312097548abaf21d91e076e18726f3ab) Add Mocha tests for checkBody() (@rustybailey)
- [bbcb462](https://github.com/ctavan/express-validator/commit/bbcb4620ada424a2352a148975eba2072d8badf3) Add tests for checkParams() (@rustybailey)
- [d2eb638](https://github.com/ctavan/express-validator/commit/d2eb638611a015dd04d4aa59c4c790ca324bcc66) Add mocha/chai as dependencies, simplify app.js helper, create mocha tests for optional(). (@rustybailey)

### v2.9.1 2015/04/28
- [9c87684](https://github.com/ctavan/express-validator/commit/9c87684a02eff71f40fc98ce3da37992fee464cd) Bump version to 2.9.1. (@rustybailey)
- [37ede78](https://github.com/ctavan/express-validator/commit/37ede786203d5b9aa87acf96bd568c26fcc6de3a) Fix checkHeader so that it works with optional(). (@rustybailey)
- [136307f](https://github.com/ctavan/express-validator/commit/136307f94aebaf4dcc7e83dee62bfd5cae9a1333) Move change log into its own file and expand it using github-changes. Fixes #130 (@rustybailey)

### v2.9.0 2015/03/20
- [c2e5124](https://github.com/ctavan/express-validator/commit/c2e512490667cc1cbc22e2de762c79cbf425354a) Bump version to 2.9.0 (@ctavan)
- [9624cca](https://github.com/ctavan/express-validator/commit/9624cca38836a7299bba570e3addd07913ded174) Update node validator dependency. (@ctavan)
- [9247648](https://github.com/ctavan/express-validator/commit/9247648f7d8fc1c8aa017ad19e1f24e90aff311a) Fix deprecated use of req.param(), closes #117. (@ctavan)
- [d8ba047](https://github.com/ctavan/express-validator/commit/d8ba0470d85e283e38870db5f9a0cde964561171) replaced req.param call to remove deprecation msg (@janza)
- [b2f727b](https://github.com/ctavan/express-validator/commit/b2f727b4d948cd7a94c6c3570fba5de5f626dc34) Add LICENSE (@becausehama)

### v2.8.0 2014/12/23
- [e49ee9d](https://github.com/ctavan/express-validator/commit/e49ee9ddb7cf3ebf804874f1ba5281f890693799) Bump version to 2.8.0 (@ctavan)
- [d48d248](https://github.com/ctavan/express-validator/commit/d48d2480f992ffbe7cac5fe00e3d75f146e5290a) Updating to validator 3.26.0 (@aredo)

### v2.7.0 2014/11/13
- [84937cf](https://github.com/ctavan/express-validator/commit/84937cf4dee304914f763d109a657bf24c61914c) Bump version 2.7.0 (@ctavan)
- [51e39b3](https://github.com/ctavan/express-validator/commit/51e39b3526a0386ab1003b6485a8351567959388) Updating to validator 3.22.1 (@nfrasser)

### v2.6.0 2014/09/24
- [8b67263](https://github.com/ctavan/express-validator/commit/8b67263c1fcf31b920e369fcb1e7a47a0eef07c6) Upgraded to validator 3.19.0 (@fiznool)

### v2.5.0 2014/09/16
- [1dc8679](https://github.com/ctavan/express-validator/commit/1dc8679ef2207e1ac886bf3eeac7f63955c042c5) Bump version to 2.5.0 (@ctavan)
- [2205323](https://github.com/ctavan/express-validator/commit/220532338d20abc57ba2510b1f51c86c31705757) adds tests for optional() method (@BAKFR)
- [7402642](https://github.com/ctavan/express-validator/commit/7402642a9a7917f16bba42c1d06503047821052b) add curly braces to respect the coding style (@BAKFR)
- [b90f482](https://github.com/ctavan/express-validator/commit/b90f482d13d446f4e5d22b9ba038be0740e9d20d) add documentation for customValidators option (@sterling)

### v2.4.0 2014/09/04
- [9d18380](https://github.com/ctavan/express-validator/commit/9d18380884562b9d8e366f1b180f9eee11658f66) Bump version to 2.4.0 (@ctavan)
- [9a167b7](https://github.com/ctavan/express-validator/commit/9a167b7e524113a78ef04e77bf946d9a8832ddc9) whitespace cleanup (@sterling)
- [668e5c5](https://github.com/ctavan/express-validator/commit/668e5c547c22c78e9b10b525d6357cf9b2e8a969) Add support for custom validators (@sterling)
- [58d2142](https://github.com/ctavan/express-validator/commit/58d2142798898cc6b6bec71a1c333324ec6d6a5a) add documentation on README (@BAKFR)
- [e42f650](https://github.com/ctavan/express-validator/commit/e42f650bb165bcaa18d36a2168a6c43968cf9c90) add the method optional() who disables the checks if value is undefined (@BAKFR)

### v2.3.0 2014/06/06
- [a922832](https://github.com/ctavan/express-validator/commit/a9228327c8969b9640646774115012c29e2f13d2) Bump version to 2.3.0 (@ctavan)
- [85348f5](https://github.com/ctavan/express-validator/commit/85348f59ed65fc657bccb9f63a91954b602855b2) Add a check if req.files array is not undefined before accessing it

### v2.2.0 2014/06/03
- [d2ea7b1](https://github.com/ctavan/express-validator/commit/d2ea7b1315cf7403776b7473798f6219ba26ade6) Bump version to 2.2.0 (@ctavan)

### v2.1.2 2014/04/28
- [6dcddc8](https://github.com/ctavan/express-validator/commit/6dcddc83d71e540d20ec2e0da3dbb717c78acd7f) Bump version to 2.1.2 (@ctavan)
- [bffe0d9](https://github.com/ctavan/express-validator/commit/bffe0d9a2ea9a29505eb2264e04badc4d68e221b) Fixed function call order (@killroy42)
- [129be78](https://github.com/ctavan/express-validator/commit/129be780252c9bb88bd281861561077d4bf96241) Fixed arguments usage for strict compliance (@killroy42)
- [defffe1](https://github.com/ctavan/express-validator/commit/defffe1b4493b7e21122fbe4f5ac877543f8a702) Update express_validator.js (@brandonscript)
- [01bdbf4](https://github.com/ctavan/express-validator/commit/01bdbf47486136364635edc73725c92f8690a90c) Return sanitized value from req.sanitize() (@dpolivy)

### v2.1.1 2014/03/17
- [151f5a4](https://github.com/ctavan/express-validator/commit/151f5a45775926a07b01366ac4846823d680871b) Bump version to 2.1.1 (@ctavan)
- [75a8359](https://github.com/ctavan/express-validator/commit/75a8359e5703c1e9476c6244bd9a2dcf98b96add) fix: use strict equality/inequality
- [010cb51](https://github.com/ctavan/express-validator/commit/010cb51f75737a347e69d5118b18789e89f28560) fix docs Extending (@bars3s)
- [7388983](https://github.com/ctavan/express-validator/commit/7388983641ac6243ba5cd24d832fad77e884b455) fix sanitaze trim,ltrim... methods (@bars3s)
- [02930ff](https://github.com/ctavan/express-validator/commit/02930ff915e319b57a5a258893aaaa0d38589c7f) add .idea to .gitignore (@bars3s)

### v2.1.0 2014/03/10
- [aaff5d9](https://github.com/ctavan/express-validator/commit/aaff5d92e006ef6ee55ee3758ccfd17fe92c22ac) Update validator to 3.5.0 and bump version to 2.1.0 (@ctavan)
- [7f3b8a9](https://github.com/ctavan/express-validator/commit/7f3b8a9119b2eb17826015cf59a36e0b3925c55a) Update README. (@ctavan)
- [079c6da](https://github.com/ctavan/express-validator/commit/079c6da0bfe14f95a0b94721488e06081e5b89ed) Update package.json (@gkorland)
- [a91664b](https://github.com/ctavan/express-validator/commit/a91664be05bd3ce37811b0c1e24a75aa8d6e5bff) Update node-validator repository url (@marcbachmann)
- [6fe2aa6](https://github.com/ctavan/express-validator/commit/6fe2aa67a7f9fd0110085e67a8066bc46cdbe605) - fixed typo (@theorm)
- [816437a](https://github.com/ctavan/express-validator/commit/816437a7df0299172d9e78ad6c3d0f29e07ebff9) - and quoting node versions to make travis linter happy (@theorm)
- [aa7d749](https://github.com/ctavan/express-validator/commit/aa7d7496b307394a0c55a7dcfbe55c45d2332d62) - removed node 0.6 from .travis.yml. 0.8+ is required now as it is the minimum version for validator.js (@theorm)
- [36e9025](https://github.com/ctavan/express-validator/commit/36e90250ed322b3aefe220dc2afb5bca40de0a5e) - setting node version to >= 0.8 (@theorm)
- [af9abb5](https://github.com/ctavan/express-validator/commit/af9abb54898438092ecba0dfff5c30eb15b32087) - camelCasing variables (@theorm)

### v2.0.0 2014/01/21
- [22fce51](https://github.com/ctavan/express-validator/commit/22fce515cf2fdf9e1064150773be96bcbae37fad) - major version bump & fixing local vars. (@theorm)

### v1.0.2 2014/01/21
- [94a3c13](https://github.com/ctavan/express-validator/commit/94a3c1360a460d6e32d1142ad412a50e4e74eb0c) - version bump and new contributor (@theorm)
- [a219e29](https://github.com/ctavan/express-validator/commit/a219e29db6d01b9c4c5f86ab91b4e23083e958ca) - modified to work with validator 3.1.0 (@theorm)
- [dc0ee77](https://github.com/ctavan/express-validator/commit/dc0ee7783a98c4922121bffe09fc6e40715cc1a0) added documentation for checkParams and checkQuery (@smitp)
- [a8604f8](https://github.com/ctavan/express-validator/commit/a8604f84e09cadceb7ce14d1118b36e11a31235c) As .xss() is removed from node-validator 2.0.0, changed example in comments (@manV)

### v1.0.1 2013/11/25
- [cd65d4c](https://github.com/ctavan/express-validator/commit/cd65d4c71e0f11ded917c20b6e98d9874ee9add6) Bump version to 1.0.1 (@ctavan)
- [63f1248](https://github.com/ctavan/express-validator/commit/63f124886cd693c70d962cdba99e92c38c4dfa18) add information from #21 as I'm not only one who was stuck at this (@kamilbiela)

### v1.0.0 2013/11/11
- [b63f224](https://github.com/ctavan/express-validator/commit/b63f224f6b5a0394e4213dfc5c399b8565ba0bcd) bumped to 1.0.0 (@petecoop)
- [5e5c0a1](https://github.com/ctavan/express-validator/commit/5e5c0a1f571c48e32f196edb461e494fa432ee0b) updated to v2 (@petecoop)
- [406014e](https://github.com/ctavan/express-validator/commit/406014e3a83fa0ead0b2bcdb012f91b93eeded94) Added support for checkQuery and checkParams + tests (@kornifex)
- [7f33f03](https://github.com/ctavan/express-validator/commit/7f33f031617554b3f5386c48de68e7de831d4ab0) Ensure req.body is defined (@cjihrig)

### v0.8.0 2013/08/22
- [57d62fe](https://github.com/ctavan/express-validator/commit/57d62fe815bd8077eac8b7b6d7686c037d9969b5) Bump version to 0.8.0 (@ctavan)
- [feec643](https://github.com/ctavan/express-validator/commit/feec64356e88e4b1cda4e13db503f6389382a469) Bump validator dependency to 1.5.0, closes #47. (@ctavan)
- [7c181e5](https://github.com/ctavan/express-validator/commit/7c181e51cb74bdfef84a4345ddd0c86d80845ebf) Update README.md (@JedWatson)

### v0.7.0 2013/07/10
- [5f59b15](https://github.com/ctavan/express-validator/commit/5f59b15751adf8f2abe615f33afce9f18e83da1a) Bump version to 0.7.0 (@ctavan)
- [69e9203](https://github.com/ctavan/express-validator/commit/69e92030324b194b372ff6dc106b40c167c2f79e) Bump validator dependency to 1.2.1 (@ctavan)
- [f726037](https://github.com/ctavan/express-validator/commit/f72603764e82e9afb7103c4b1e3090a4e4daadce) Fix two typos (@Michael-Stanford)
- [2f52adb](https://github.com/ctavan/express-validator/commit/2f52adbe46ca9f09da58fa98c33dd197bf57cfe3) Check parsed attached Files (@gkorland)
- [9dde887](https://github.com/ctavan/express-validator/commit/9dde8870ba97be360e12bfae50a39751443b22a0) replace 500 code with 400 (@gkorland)
- [09f5c43](https://github.com/ctavan/express-validator/commit/09f5c435e9918270876b53218e8b6c4ab5b91c1c) Also run tests under node v0.10 in travis. (@ctavan)

### v0.6.0 2013/06/14
- [d493673](https://github.com/ctavan/express-validator/commit/d493673956ee0a1c89e2729366dc636fc3c2b1fd) Bump version to 0.6.0. (@ctavan)
- [5aecec5](https://github.com/ctavan/express-validator/commit/5aecec55b476c586332fc4336b2f5997ed6d034c) Bump validator dependency to 1.2.0 (@ctavan)
- [8fe0862](https://github.com/ctavan/express-validator/commit/8fe086282661c10b1765b557423144adb90d2e17) Bumped version to 5 because this is a breaking change. (@arb)
- [066807b](https://github.com/ctavan/express-validator/commit/066807bd25352e06ab6ad9e58088ebd22ab66d3b) Fixed to work with new structure. (@arb)
- [15216ae](https://github.com/ctavan/express-validator/commit/15216ae24ffceff4f04cb28df4ad001d857c2249) Added method to pass options. (@arb)
- [3a341f5](https://github.com/ctavan/express-validator/commit/3a341f5fc03ab75ba2b653ab208f7801422e1665) Added options section (@arb)

### v0.4.1 2013/06/06
- [e739e2b](https://github.com/ctavan/express-validator/commit/e739e2b6877d58707bdad598f9f634d88f417081) Bump version to 0.4.1 (@ctavan)
- [3f03a68](https://github.com/ctavan/express-validator/commit/3f03a683f7732ac39f53324ed6842120e78b8262) Update readme. (@ctavan)

### v0.4.0 2013/06/06
- [1fe9c03](https://github.com/ctavan/express-validator/commit/1fe9c03f1f4416c5c921429ae775c8bfa4773d2d) Bump version to 0.4.0 (@ctavan)
- [0139626](https://github.com/ctavan/express-validator/commit/0139626b09f9072e2f7739fa2a7c7bd10ab74bb0) Upgrade validator dependency. (@ctavan)
- [5ac347c](https://github.com/ctavan/express-validator/commit/5ac347c8aa3b5abfb085bcf740a8ecae6befc51f) Added ignore file to modules stop being marked as changed. (@arb)
- [96e759e](https://github.com/ctavan/express-validator/commit/96e759e0df154352bef835013fb0a71b5416e5ca) Added test for req.checkBody (@arb)
- [a37b8d7](https://github.com/ctavan/express-validator/commit/a37b8d7d1db41673ef76755178be3fa4335aac56) Added myself to the contributers. (@arb)
- [7bf7729](https://github.com/ctavan/express-validator/commit/7bf77296a00469e9d4de7941cb8968e955da13fd) Style change. (@arb)
- [7cb9113](https://github.com/ctavan/express-validator/commit/7cb9113bec43e28c3ec1f78a2a3e20d763da6f3b) Added check body function to validate only the request body. (@arb)
- [69fdeed](https://github.com/ctavan/express-validator/commit/69fdeed8e82681ee03d9ba347a9b180ee17dade5) Sorry, was moving this around without updating. (@Prinzhorn)
- [9ae9e6b](https://github.com/ctavan/express-validator/commit/9ae9e6be816f8550667ed6a4f3e595d1204f4a43) Updated the documentation about extending. (@Prinzhorn)

### v0.3.2 2013/02/27
- [3c1c52c](https://github.com/ctavan/express-validator/commit/3c1c52c7a10fd79b42814c3c6c28ecece9f6dd71) Bump version to 0.3.2 (@ctavan)
- [4ff8a48](https://github.com/ctavan/express-validator/commit/4ff8a4879aa303ea9ef5f98760eb730a48a184f3) Upgrade validator dependency to 0.4.25. Fixes #25. (@ctavan)

### v0.3.1 2013/01/03
- [48f90b7](https://github.com/ctavan/express-validator/commit/48f90b7922a12fbfbef8bc10bcf98a913dd043ad) Bump version to 0.3.1 (@ctavan)
- [c4463f7](https://github.com/ctavan/express-validator/commit/c4463f767ba75ec61f75e8f13455a003b1076c36) Update package.json

### v0.3.0 2012/10/08
- [fa23c0f](https://github.com/ctavan/express-validator/commit/fa23c0f952e781cdf25d2167b870638440cb5eb5) Bump version to 0.3.0 (@ctavan)
- [62bb9dd](https://github.com/ctavan/express-validator/commit/62bb9dd27f1519e3eebaad2647a51cdf7c82675f) Update validator dependency. (@ctavan)
- [e241d9f](https://github.com/ctavan/express-validator/commit/e241d9fa0accab8fc550c5d5aa398c80a0d38b79) Return `null` for validation errors instead of array. (@ctavan)
- [b60e434](https://github.com/ctavan/express-validator/commit/b60e434e03de9e1e37928381beb71031b86cd446) Fix docs. (@ctavan)

### v0.2.4 2012/08/20
- [1fb5b56](https://github.com/ctavan/express-validator/commit/1fb5b560813b3bd1f0d4a9f556b62804b231d94d) Bump version to v0.2.4 (@ctavan)
- [521e50b](https://github.com/ctavan/express-validator/commit/521e50babe0f40c87cc861d835954ce58c3f2ba6) Fix code style / line lengths. (@ctavan)
- [31d51d2](https://github.com/ctavan/express-validator/commit/31d51d245bb9c8f654e62f0ebdd6c9388d80bbf1) Tests for RegExp-defined routes (@cecchi)
- [f73af12](https://github.com/ctavan/express-validator/commit/f73af126290035577cec014630cb478f08d383bb) Using strict comparison (@cecchi)
- [3ba4e3f](https://github.com/ctavan/express-validator/commit/3ba4e3f2340e9e5000b2dd7dd2e83050ecfb236c) Support for routes defined by RegExp (@cecchi)

### v0.2.3 2012/08/03
- [1590b47](https://github.com/ctavan/express-validator/commit/1590b471943e72535be883d3d718b08eeb8034ad) Bump version to 0.2.3 (@ctavan)
- [fda5c03](https://github.com/ctavan/express-validator/commit/fda5c0374298b8d14e6695143db27c6fd3129f2e) Remove node 0.4 from travis and add 0.8 (@ctavan)

### v0.2.2 2012/08/03
- [9537060](https://github.com/ctavan/express-validator/commit/95370604bfde8ff8326c65e64c6a7cb5cc91b386) Update dependencies and bump version to v0.2.2 (@ctavan)
- [c73802c](https://github.com/ctavan/express-validator/commit/c73802c95a5831415c10f8f8de9616f2fa133705) Add documentation (@ctavan)
- [672d48b](https://github.com/ctavan/express-validator/commit/672d48bc3549734edebcbabe9bc6067393f8dd18) Fix coding style (@ctavan)
- [dfccb6d](https://github.com/ctavan/express-validator/commit/dfccb6d68636b53cb7d78d2cdac4433b40f8a014) Restore removed test case (@ctavan)
- [de62248](https://github.com/ctavan/express-validator/commit/de6224811f666f5945267d2439da20b173efb4b5) Updated test for testing nested dot notation (@sharonjl)
- [2ff7983](https://github.com/ctavan/express-validator/commit/2ff7983a7579f303716f4c176277cbd05935481e) Updated method for parsing nested notation (@sharonjl)
- [c54720f](https://github.com/ctavan/express-validator/commit/c54720f74a517f1bd9bcbbb37364ff5107316565) Added validate() alias for check() (@sharonjl)
- [1b94da6](https://github.com/ctavan/express-validator/commit/1b94da675a86921b73450997c10aa52a5e0c0cf2) Update lib/express_validator.js (@pimguilherme)

### v0.2.1 2012/04/25
- [2a5903d](https://github.com/ctavan/express-validator/commit/2a5903dd629f183c278ff0279637ea44ee517eb5) Bump version to 0.2.1 (@ctavan)
- [861806d](https://github.com/ctavan/express-validator/commit/861806d375dce1d8533435219047e742b4d7bf36) Fix chaining validators (@rapee)
- [5436c0f](https://github.com/ctavan/express-validator/commit/5436c0f5020e97f0a74a09a79e40f88fb532ad89) Add travis.ci (@ctavan)
- [65506ba](https://github.com/ctavan/express-validator/commit/65506bac7a62bc7b50c7213e761a81b536fd1578) Code style fixes (@ctavan)
- [94062f0](https://github.com/ctavan/express-validator/commit/94062f051b8ce10cc87cb20079ee7f553f9e449f) Add Makefile (@ctavan)
- [07f4f06](https://github.com/ctavan/express-validator/commit/07f4f060d5cadbfb2465efe93373a8a7d4fc949e) Add @orfaust to contributors (@ctavan)
- [c4b83d0](https://github.com/ctavan/express-validator/commit/c4b83d0db478e22e557de96649a77b7ab264c168) Add more tests, document additions (@ctavan)
- [c3f3a3e](https://github.com/ctavan/express-validator/commit/c3f3a3e704f95ec14f0e8a12375313ff2c177468) Remove unused variable (@ctavan)
- [dc0d92b](https://github.com/ctavan/express-validator/commit/dc0d92b4430547971c9934b663b3c985a30f6bcf) Refactor tests (@ctavan)
- [cae328a](https://github.com/ctavan/express-validator/commit/cae328a6692130df0335582ab26138f09393210e) Add basic test cases and upgrade versions (@ctavan)
- [0c33221](https://github.com/ctavan/express-validator/commit/0c332216cacf70857cbaa7bbb1ce16aeab7bd471) 1: solution for nested inputs. 2: more complete errors response (@orfaust)
- [0d63f04](https://github.com/ctavan/express-validator/commit/0d63f0442e795ec0371e73050076ea3dd60c0725) Fix for undefined req.onErrorCallback (@orfaust)
- [efba5e8](https://github.com/ctavan/express-validator/commit/efba5e82b81cd14b1ec953a56ec531d8169c1fbd) get complete error objects (@orfaust)

### v0.1.3 2012/01/02
- [4e8f245](https://github.com/ctavan/express-validator/commit/4e8f2451266e6a3a7b20180c723e5760fdef89b9) Version bump v0.1.3 (@ctavan)
- [1041b4c](https://github.com/ctavan/express-validator/commit/1041b4c44c7819fc44aa572fcbf2135bc2518b07) Add another example to the readme (@ctavan)
- [cb7d906](https://github.com/ctavan/express-validator/commit/cb7d906718d6023cce485b2b033647928510b8ef) Update readme (@ctavan)

### v0.1.2 2012/01/02
- [3d323c6](https://github.com/ctavan/express-validator/commit/3d323c6daabc6b106a24aca645e527c204370078) Version bump (@ctavan)
- [de0773c](https://github.com/ctavan/express-validator/commit/de0773ce497aed71bee576b0378635e5c51d494c) exposed Validator & Filter to module so that end-users can easily hang their own validations/sanitizers onto them (@troygoode)
- [bed2d78](https://github.com/ctavan/express-validator/commit/bed2d78417ae3e71ef198b48f005da7af98c1710) Also update readme, see #2 (@ctavan)
- [fffa37f](https://github.com/ctavan/express-validator/commit/fffa37f51d9ba769b562ad7170e29ab391b0588c) Return this in error callback to allow for assert-method-chaining, fixes #2 (@ctavan)

### v0.1.1 2011/10/20
- [d8a7658](https://github.com/ctavan/express-validator/commit/d8a7658ddd34e72c445a5827034481a1e91605b4) Add some keywords (@ctavan)
- [9fd2261](https://github.com/ctavan/express-validator/commit/9fd2261817c3fbe32de26670747c020cf6eb0b71) Update version to v0.1.1 (@ctavan)
- [722d9a7](https://github.com/ctavan/express-validator/commit/722d9a7c98fe9e00968eea5b9660f51c073afd1a) Remove now unneeded mixinParams() method, see #1 (@ctavan)
- [fbd6461](https://github.com/ctavan/express-validator/commit/fbd64617e354c06aac5bbd30d338bb4aa303beca) Update example and documentation for changes of #1, fixes #1 (@ctavan)
- [ce69619](https://github.com/ctavan/express-validator/commit/ce69619266357cada2efa3508ae036b9e483a726) Use req.param() instead of req.params + req.mixinParams() for filter() as well. (@ctavan)
- [0e77df0](https://github.com/ctavan/express-validator/commit/0e77df06d688e69d801976264d23d8bc8bd662bb) Use express's req.param() to get params from req.params, req.query and req.body. req.check now no longer relies on req.mixinParams(), see #1 (@ctavan)
- [779660f](https://github.com/ctavan/express-validator/commit/779660f47565bf6cfc66c447f75448d585831821) Typo (@ctavan)
- [7f398b2](https://github.com/ctavan/express-validator/commit/7f398b29404a93c5222ec339f7aaecf4c143f28b) Installation note (@ctavan)

### v0.1.0 2011/10/05
- [764b5dc](https://github.com/ctavan/express-validator/commit/764b5dc4b63df8f1b2ae23602b75e3d4281b793c) Formatting (@ctavan)
- [d0090e7](https://github.com/ctavan/express-validator/commit/d0090e750ad99ce1d1d0bece930da90c1a2c1743) Add me as a contributor + fix some typos (@ctavan)
- [3537462](https://github.com/ctavan/express-validator/commit/3537462d697f520c18e362e0bad3f453dc26847f) Add original author credits to the packag.json (@ctavan)
- [671ad61](https://github.com/ctavan/express-validator/commit/671ad613c85d546328f05e238a8a1ee27ec6ac2c) Add an example server (@ctavan)
- [ae10270](https://github.com/ctavan/express-validator/commit/ae102704accf206ca617a12014a26c03251a365d) Typos (@ctavan)
- [0dfb1ba](https://github.com/ctavan/express-validator/commit/0dfb1ba5d38039a53f139bacff74e1fb920faec8) Improve example in readme, add credits for original author (@ctavan)
- [df36372](https://github.com/ctavan/express-validator/commit/df36372d05928c8f46c69cf056705f977334a167) Initial commit (@ctavan)