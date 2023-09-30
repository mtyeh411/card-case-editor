/*
 * Interactive j-card template logic.
 */
var jcard = (function() {
    // find input elements in the controls module
    function findInputs(controls) {
        return {
            // options
            print2:           controls.querySelector('#controls-print-2'),
            flip:             controls.querySelector('#controls-flip'),

            font:             controls.querySelector('#controls-font'),
            cardColor:        controls.querySelector('#controls-card-color'),
            textColor:        controls.querySelector('#controls-text-color'),
            forceCaps:        controls.querySelector('#controls-force-caps'),

            // front
            /// image
            cover:            controls.querySelector('#controls-cover'),
            fullCover:        controls.querySelector('#controls-full-bleed-cover'),
            cropCoverX:       controls.querySelector('#controls-crop-cover-x'),
            cropCoverY:       controls.querySelector('#controls-crop-cover-y'),
            fixedHeight:      controls.querySelector('#controls-fixed-height-cover'),
            /// text
            showFrontText:    controls.querySelector('#controls-show-front-text'),
            title:            controls.querySelector('#controls-title'),
            subtitle:         controls.querySelector('#controls-subtitle'),
            titleSize:        controls.querySelector('#controls-title-size'),
            //frontText:        controls.querySelector('#controls-front-text'),
            titleSpacing:     controls.querySelector('#controls-title-spacing'),
            frontTextSize:    controls.querySelector('#controls-front-text-size'),

            // spine
            /// upper spine
            upperSpine:       controls.querySelector('#controls-upper-spine'),
            showUpperSpine:   controls.querySelector('#controls-show-upper-spine'),
            spineTitle:            controls.querySelector('#controls-spine-title'),
            spineSubtitle:         controls.querySelector('#controls-spine-subtitle'),
            spineTitleSpacing:     controls.querySelector('#controls-spine-title-spacing'),
            spineTitleSize:     controls.querySelector('#controls-spine-title-size'),
            /// middle spine
            noteUpper:        controls.querySelector('#controls-note-upper'),
            noteLower:        controls.querySelector('#controls-note-lower'),
            noteSize:         controls.querySelector('#controls-note-size'),
            /// lower spine
            lowerSpine:       controls.querySelector('#controls-lower-spine'),
            showLowerSpine:   controls.querySelector('#controls-show-lower-spine'),
            rotateLowerSpine:       controls.querySelector('#controls-rotate-lower-spine'),

            // back
            /// image
            backImage:        controls.querySelector('#controls-back-image'),
            showBackImage:    controls.querySelector('#controls-show-back-image'),
            backImageRotate:  controls.querySelector('#controls-rotate-back-image'),
            /// text
            backPortrait:     controls.querySelector('#controls-back-portrait'),
            backLandscape:    controls.querySelector('#controls-back-landscape'),
            sideA:            controls.querySelector('#controls-side-a'),
            sideB:            controls.querySelector('#controls-side-b'),
            shortBack:        controls.querySelector('#controls-short-back'),
            hideHeadings:     controls.querySelector('#controls-hide-headings'),
            backSize:         controls.querySelector('#controls-back-size'),
        }
    }

    // find output elements in the template module
    function findOutputs(template) {
        return {
            root:           template,
            boundaries:     template.querySelector('.template-boundaries'),

            // front
            cover:          template.querySelector('.template-cover'),
            coverContainer: template.querySelector('.template-cover-container'),
            frontTitleGroup: template.querySelector('.template-front-title-group'),
            frontTitle:     template.querySelector('.template-front-title'),
            frontSubtitle:  template.querySelector('.template-front-subtitle'),
            frontText:      template.querySelector('.template-front-text'),
            frontTextGroup: template.querySelector('.template-front-group'),

            // spine
            upperSpine:     template.querySelector('.template-upper-spine'),
            upperSpineContainer:     template.querySelector('.template-upper-spine-container'),
            spineTitleGroup: template.querySelector('.template-spine-title-group'),
            spineTitle:     template.querySelector('.template-spine-title'),
            spineSubtitle:  template.querySelector('.template-spine-subtitle'),
            noteGroup:      template.querySelector('.template-note-group'),
            noteUpper:      template.querySelector('.template-note-upper'),
            noteLower:      template.querySelector('.template-note-lower'),
            lowerSpine:     template.querySelector('.template-lower-spine'),

            // back
            back:           template.querySelector('.template-back'),
            backImage:      template.querySelector('.template-back-image'),
            sideA:          template.querySelector('.template-side-a'),
            sideB:          template.querySelector('.template-side-b')
        }
    }

    // add listeners to inputs that toggle option classes
    function addOptionListeners(inputs, root) {
        addToggleListener(inputs.print2, root, 'print-2');
    }

    // add listeners to inputs that update j-card outputs
    function addJCardListeners(inputs, outputs) {
        // options
        addToggleListener(inputs.forceCaps, outputs.root, 'force-caps');
        addColorListener(inputs.textColor, outputs.root, 'color');
        addColorListener(inputs.cardColor, outputs.boundaries, 'backgroundColor');
        addFontFaceListener(inputs.font, outputs.root);
        addToggleListener(inputs.flip, outputs.root, 'is-flipped');

        // front
        /// image
        addToggleListener(inputs.fullCover, outputs.root, 'full-bleed-cover');
        addImageListener(inputs.cover, outputs.cover);
        addCropListener(inputs.cropCoverX, outputs.cover, 'x');
        addCropListener(inputs.cropCoverY, outputs.cover, 'y');
        addToggleListener(inputs.fixedHeight, outputs.coverContainer, 'has-fixed-height');
        /// text
        addTextListener(inputs.title, outputs.frontTitle);
        addTextListener(inputs.subtitle, outputs.frontSubtitle);
        addLetterSpacingListener(inputs.titleSpacing, outputs.frontTitle);
        addSizeListener(inputs.titleSize, outputs.frontTitleGroup);
        addVisibilityListener(inputs.showFrontText, outputs.frontTextGroup);
        addSizeListener(inputs.frontTextSize, outputs.frontText);
        //addTextListener(inputs.frontText, outputs.frontText);

        // spine
        /// upper spine
        addVisibilityListener(inputs.showUpperSpine, outputs.upperSpineContainer);
        addImageListener(inputs.upperSpine, outputs.upperSpine);
        addTextListener(inputs.spineTitle, outputs.spineTitle);
        addTextListener(inputs.spineSubtitle, outputs.spineSubtitle);
        addLetterSpacingListener(inputs.spineTitleSpacing, outputs.spineTitle);
        addSizeListener(inputs.spineTitleSize, outputs.spineTitleGroup);
        /// middle spine
        addTextListener(inputs.noteUpper, outputs.noteUpper);
        addTextListener(inputs.noteLower, outputs.noteLower);
        addSizeListener(inputs.noteSize, outputs.noteGroup);
        /// lower spine
        addVisibilityListener(inputs.showLowerSpine, outputs.lowerSpine);
        addImageListener(inputs.lowerSpine, outputs.lowerSpine);
        addRotationListener(inputs.rotateLowerSpine, outputs.lowerSpine);

        // back
        /// image
        addImageListener(inputs.backImage, outputs.backImage);
        addRotationListener(inputs.backImageRotate, outputs.backImage);
        addVisibilityListener(inputs.showBackImage, outputs.backImage);
        /// text
        addToggleListener(inputs.shortBack, outputs.root, 'short-back');
        addToggleListener(inputs.hideHeadings, outputs.back, 'hide-headings');
        addSideListener(inputs.sideA, outputs.sideA);
        addSideListener(inputs.sideB, outputs.sideB);
        addTracksListener([inputs.sideA, inputs.sideB], outputs.frontText);
        addSizeListener(inputs.backSize, outputs.sideA);
        addSizeListener(inputs.backSize, outputs.sideB);
        addToggleListener(inputs.backPortrait, outputs.back, 'is-portrait', ['is-landscape']);
        addToggleListener(inputs.backLandscape, outputs.back, 'is-landscape', ['is-portrait'])
    }

    // populate inputs with field values or defaults
    function populate(inputs, fields) {
        // options
        inputs.font.value = fields.font || 'Alte Haas Grotesk';
        inputs.cardColor.value = fields.card_color || 'white';
        inputs.textColor.value = fields.text_color || 'black';
        inputs.flip.checked = fields.flipped !== undefined ? fields.flipped : false;
        inputs.forceCaps.checked = false; //fields.force_caps !== undefined ? fields.force_caps : false;

        // front
        /// image
        inputs.fullCover.checked = fields.full_cover !== undefined ? fields.full_cover : false;
        inputs.cropCoverX.value = fields.crop_cover_x || 0;
        inputs.cropCoverY.value = fields.crop_cover_y || 0;
        inputs.fixedHeight.checked = fields.fixed_height !== undefined ? fields.fixed_height : false;
        /// text
        inputs.title.value = fields.title || '';
        inputs.subtitle.value = fields.subtitle || '';
        inputs.titleSize.value = fields.title_size || 12;
        //inputs.frontText.value = fields.front_text || '';
        inputs.frontTextSize.value = fields.front_text_size || 10;
        inputs.showFrontText.checked = fields.show_front_text !== undefined ? fields.show_front_text : false;
        inputs.titleSpacing.value = fields.title_spacing || 0;

        // spine
        /// upper spine
        inputs.showUpperSpine.checked = fields.show_upper_spine !== undefined ? fields.show_upper_spine : false;
        inputs.spineTitle.value = fields.spine_title || '';
        inputs.spineSubtitle.value = fields.spine_subtitle || '';
        inputs.spineTitleSize.value = fields.spine_title_size || 12;
        /// middle spine
        inputs.noteUpper.value = fields.note_upper || '';
        inputs.noteLower.value = fields.note_lower || '';
        inputs.noteSize.value = fields.note_size || 10;
        /// lower spine
        inputs.showLowerSpine.checked = fields.show_lower_spine !== undefined ? fields.show_lower_spine : false;

        // back
        inputs.shortBack.checked = fields.short_back !== undefined ? fields.short_back : false;
        inputs.sideA.value = formatList(fields.side_a || []);
        inputs.sideB.value = formatList(fields.side_b || []);
        inputs.backSize.value = fields.back_size || 8;
        inputs.hideHeadings.checked = fields.hide_headings !== undefined ? fields.hide_headings : false;
        inputs.showBackImage.checked = fields.show_back_image !== undefined ? fields.show_back_image : false;

        inputs.backPortrait.checked = false;
        inputs.backLandscape.checked = true;
        if (fields.back_orientation !== undefined) {
            inputs.backPortrait.checked = fields.back_orientation === 'portrait';
            inputs.backLandscape.checked = fields.back_orientation === 'landscape';
        }
    }

    // trigger listener calls on all fields
    function update(inputs) {
        for (name in inputs) {
            var input = inputs[name];
            var event = document.createEvent('Event');
            if (input.type === 'checkbox' || input.type === 'file' || input.type === 'radio') {
                event.initEvent('change', true, true);
            } else {
                event.initEvent('input', true, true);
            }
            input.dispatchEvent(event);
        }
    }

    function addLetterSpacingListener(input, output) {
        input.addEventListener('input', function(event) {
            output.style.letterSpacing = input.value + 'in';
        });
    }

    function addRotationListener(input, output) {
        input.addEventListener('input', function(event) {
            output.style.transform = 'rotate(' + input.value + 'deg)';
        });
    }

    function addCropListener(input, output, axis) {
        input.addEventListener('input', function(event) {
            if ((initPosition = output.style.objectPosition) === "") {
                initPosition = "0px 0px";
            }
            var position = initPosition.split(" ");
            var newPosition;
            switch(axis) {
                case 'x':
                    newPosition = [input.value + 'px', position[1]].join(" ")
                    break;
                case 'y':
                    newPosition = [position[0], input.value + 'px'].join(" ")
                    break;
                default:
                    newPosition = initPosition;
                    break;
            }

            output.style.objectPosition = newPosition;
        });
    }

    // copy an input value to an output innerHTML on input change
    function addTextListener(input, output) {
        input.addEventListener('input', function(event) {
            output.innerHTML = input.value;
        });
    }

    // toggle a class on an output element when an input is checked
    function addToggleListener(input, output, toggleClass, inverseClasses = []) {
        input.addEventListener('change', function(event) {
            if (input.checked) {
                output.classList.add(toggleClass);
                inverseClasses.forEach(function(inverseClass) {
                    output.classList.remove(inverseClass);
                })
            } else {
                output.classList.remove(toggleClass);
                inverseClasses.forEach(function(inverseClass) {
                    output.classList.add(inverseClass);
                })
            }
        });
    }

    function addVisibilityListener(input, output) {
        input.addEventListener('change', function(event) {
            if (input.checked) {
                output.classList.add('is-visible');
                output.classList.remove('is-hidden');
            } else {
                output.classList.add('is-hidden');
                output.classList.remove('is-visible');
            }
        });
    }

    function addFontFaceListener(input, output) {
        input.addEventListener('input', function(event) {
            output.style.fontFamily = input.value;
        })
    }

    // set the font size of an output element to the input value on change
    function addSizeListener(input, output) {
        input.addEventListener('input', function(event) {
            output.style.fontSize = input.value + 'pt';
        });
    }

    // set a property of the output element's style to a color on change
    function addColorListener(input, output, property) {
        input.addEventListener('input', function(event) {
            output.style[property] = input.value;
        });
    }

    // set the src property of an image when a file is selected
    function addImageListener(input, output) {
        input.addEventListener('change', function(event) {
            var file = input.files[0];
            if (file) {
                output.src = URL.createObjectURL(file);
            }
        });
    }

    // format an input list and set an output innerHTML on input change
    function addSideListener(input, output) {
        input.addEventListener('input', function(event) {
            output.innerHTML = formatListText(input.value);
        });
    }

    // combine and format input lists and set output innerHTML on any input change
    function addTracksListener(inputs, output) {
        inputs.forEach(function(input) {
            input.addEventListener('input', function(event) {
                var rawSides = inputs.map(function(input) { return input.value; });
                var rawTracks = formatList(rawSides);
                output.innerHTML = formatListText(rawTracks);
            });
        });
    }

    // convert a list to a newline delimited string
    function formatList(list) {
        return list.join('\n');
    }

    // convert a newline delimited string to a bullet delimited string
    function formatListText(listText) {
        return listText.trim().replace(/\s*\n\s*/g, '&nbsp;• ');
    }

    return {
        init: function(selector, fields) {
            var root = document.querySelector(selector);

            // find controls
            var controls = root.querySelector('#controls');
            var inputs = findInputs(controls);

            // find preview template
            var previewTemplate = root.querySelector('.jcard-preview .template');
            var previewOutputs = findOutputs(previewTemplate);

            // create duplicate template to be shown only when printed
            var dupeContainer = root.querySelector('.jcard-duplicate');
            var dupeTemplate = previewTemplate.cloneNode(true);
            var dupeOutputs = findOutputs(dupeTemplate);
            dupeContainer.appendChild(dupeTemplate);

            // register listeners
            addOptionListeners(inputs, root);
            addJCardListeners(inputs, previewOutputs);
            addJCardListeners(inputs, dupeOutputs);

            // initialize inputs and templates
            populate(inputs, fields);
            update(inputs);
        }
    }
})();
