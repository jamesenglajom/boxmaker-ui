<template>
    <div>
        <div class="card-body">
            <form action="http://templatemaker-dev.signcut.com" id="form-arced" target="_blank">
                <img data-src="//templatemaker-dev.signcut.com?MODEL=arced&CUSTOMER=whisqu&REQUEST=EXPLANATION"
                    class="w-50" />
                <div class="w-50 preview" id="preview-arced"></div>
                <p class="mt-3">Box with decorative, arced top and snap-lock-bottom.</p>
                <input type="hidden" value="arced" name="MODEL" />
                <input type="hidden" value="SIGNCUT" name="REQUEST" />
                <input type="hidden" value="whisqu" name="CUSTOMER" />
                <input type="hidden" name="KEY"
                    value="gAAAAABkb1pSH9WzvMxDZ6e6OzGpO-EWXXBFXxkoJoK_tj-xm9RUdSDlvMXH7iW6Msd_drIsFvOP6AH6kYmpV87bOhxJaltelQ==" />
                <div class="container-fluid">
                    <div class="row formrows">
                        <fieldset class="col">
                            <legend>dimensions</legend>
                            <div class="row mb-3">
                                <label class="col-sm-6 col-form-label form-control-sm">Units</label>
                                <div class="col-sm-6 input-group-sm">
                                    <div class="btn-group btn-group-sm">
                                        <input type="radio" class="btn-check" name="UNITS" value="mm" id="b5710534"
                                            autocomplete="off" checked>
                                        <label class="btn btn-outline-secondary" for="b5710534">mm</label>
                                        <input type="radio" class="btn-check" name="UNITS" value="cm" id="5b1711a4"
                                            autocomplete="off">
                                        <label class="btn btn-outline-secondary" for="5b1711a4">cm</label>
                                        <input type="radio" class="btn-check" name="UNITS" value="inch" id="d7fda204"
                                            autocomplete="off">
                                        <label class="btn btn-outline-secondary" for="d7fda204">inch</label>
                                    </div>
                                </div>
                            </div>
                            <div class="basic">
                                <div class="row mb-3">
                                    <label class="col-sm-6 col-form-label form-control-sm">Length</label>
                                    <div class="col-sm-6 input-group-sm">
                                        <input class="form-control form-control-sm measure" name="L" type="text"
                                            value="100" /><span
                                            class="input-group-text text-center suffix form-control-sm">mm</span>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label class="col-sm-6 col-form-label form-control-sm">Width</label>
                                    <div class="col-sm-6 input-group-sm">
                                        <input class="form-control form-control-sm measure" name="W" type="text"
                                            value="70" /><span
                                            class="input-group-text text-center suffix form-control-sm">mm</span>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label class="col-sm-6 col-form-label form-control-sm">Height</label>

                                    <div class="col-sm-6 input-group-sm">
                                        <input class="form-control form-control-sm measure" name="H" type="text"
                                            value="50" /><span
                                            class="input-group-text text-center suffix form-control-sm">mm</span>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div class="row mb-3">
                                <label class="col-sm-6 col-form-label form-control-sm">Material thickness</label>
                                <div class="col-sm-6 input-group-sm">
                                    <input class="form-control form-control-sm measure" name="T" type="text"
                                        value="0.5" /><span
                                        class="input-group-text text-center suffix form-control-sm">mm</span>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label class="col-sm-6 col-form-label form-control-sm">Segments per arc</label>
                                <div class="col-sm-6 input-group-sm">
                                    <input class="form-control form-control-sm number" name="N" type="text"
                                        value="8" /><span
                                        class="input-group-text text-center suffix form-control-sm">&nbsp</span>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label class="col-sm-6 col-form-label form-control-sm">Slot Width</label>
                                <div class="col-sm-6 input-group-sm">
                                    <input class="form-control form-control-sm measure" name="SLOT" type="text"
                                        value="2" /><span
                                        class="input-group-text text-center suffix form-control-sm">mm</span>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label class="col-sm-6 col-form-label form-control-sm">Closing Flap Size</label>

                                <div class="col-sm-6 input-group-sm">
                                    <input class="form-control form-control-sm measure" name="FLAP" type="text"
                                        value="20" /><span
                                        class="input-group-text text-center suffix form-control-sm">mm</span>


                                </div>

                            </div>
                            <div class="row mb-3">
                                <label class="col-sm-6 col-form-label form-control-sm">Glue Flap Angle</label>

                                <div class="col-sm-6 input-group-sm">
                                    <input class="form-control form-control-sm angle" name="GLUEANGLE" type="text"
                                        value="80" /><span
                                        class="input-group-text text-center suffix form-control-sm">&deg;</span>


                                </div>

                            </div>
                            <div class="row mb-3">
                                <label class="col-sm-6 col-form-label form-control-sm">Glue Flap Size</label>

                                <div class="col-sm-6 input-group-sm">
                                    <input class="form-control form-control-sm measure" name="GLUE" type="text"
                                        value="15" /><span
                                        class="input-group-text text-center suffix form-control-sm">mm</span>


                                </div>

                            </div>
                            <div class="row mb-3">
                                <label class="col-sm-6 col-form-label form-control-sm">Crash Lock Corner Radius</label>

                                <div class="col-sm-6 input-group-sm">
                                    <input class="form-control form-control-sm measure" name="R" type="text"
                                        value="10" /><span
                                        class="input-group-text text-center suffix form-control-sm">mm</span>


                                </div>

                            </div>
                            <div class="row mb-3">
                                <label class="col-sm-6 col-form-label form-control-sm">Crash lock flap size</label>

                                <div class="col-sm-6 input-group-sm">
                                    <input class="form-control form-control-sm measure" name="CRASH" type="text"
                                        value="10" /><span
                                        class="input-group-text text-center suffix form-control-sm">mm</span>


                                </div>

                            </div>
                        </fieldset>

                        <fieldset class="col" id="fieldset-professional">
                            <legend>professional</legend>
                            <div class="row mb-3">
                                <label class="col-sm-6 col-form-label form-control-sm">Page Size</label>
                                <div class="col-sm-6 input-group-sm">
                                    <select name="PAGEPRESET" class="form-select">
                                        <option value="Auto">Fit page to drawing</option>
                                        <option value="Custom">Custom: you decide.</option>
                                        <option value="A4">A4 Portrait (210 x 297 mm )</option>
                                        <option value="A4L">A4 Landscape (297 x 210 mm )</option>
                                        <option value="Letter">US Letter Portrait (8.5 x 11 inch)</option>
                                        <option value="LetterL">US Letter Landscape (11 x 8.5 inch)</option>
                                        <option value="A3">A3 Portrait ( 297 x 420 mm)</option>
                                        <option value="A3L">A3 Landscape (410 x 297 mm)</option>
                                        <option value="12x12">12 x 12 inch for desktop cutting plotters</option>
                                        <option value="12x24">12 x 24 inch for desktop cutting plotters</option>
                                        <option value="24x12">24 x 12 inch for desktop cutting plotters</option>
                                        <option value="A3PLUS">A3 Plus (Portrait)</option>
                                        <option value="A3PLUSL">A3 Plus (Landscape)</option>
                                        <option value="1020x710">1020 x 710 mm</option>
                                        <option value="710x1020">710 x 2020 mm</option>
                                        <option value="915x540">915 x 540 mm</option>
                                        <option value="540x915">540 x 915 mm</option>
                                        <option value="FLUTE">Flute Board, 1200 x 2400 mm</option>
                                        <option value="FLUTEL">Flute Board Landscape, 2400x1200 mm</option>
                                        <option value="GLOWFORGE">Glowforge (Portrait)</option>
                                        <option value="GLOWFORGEL">Glowforge (Landscape)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label class="col-sm-6 col-form-label form-control-sm">Page Width</label>
                                <div class="col-sm-6 input-group-sm">
                                    <input class="form-control form-control-sm measure" name="PAGEWIDTH" type="text"
                                        value="200" /><span
                                        class="input-group-text text-center suffix form-control-sm">mm</span>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label class="col-sm-6 col-form-label form-control-sm">Page Height</label>
                                <div class="col-sm-6 input-group-sm">
                                    <input class="form-control form-control-sm measure" name="PAGEHEIGHT" type="text"
                                        value="200" /><span
                                        class="input-group-text text-center suffix form-control-sm">mm</span>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label class="col-sm-6 col-form-label form-control-sm">Registration marks</label>
                                <div class="col-sm-6 input-group-sm">
                                    <select name="REGISTRATION" class="form-select">
                                        <option value="none">No Registration Marks</option>
                                        <option value="page">In the corners of the page</option>
                                        <option value="model">Around each model</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label class="col-sm-6 col-form-label form-control-sm">Registration Mark Diameter</label>
                                <div class="col-sm-6 input-group-sm">
                                    <input class="form-control form-control-sm measure" name="MARK" type="text"
                                        value="6" /><span
                                        class="input-group-text text-center suffix form-control-sm">mm</span>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label class="col-sm-6 col-form-label form-control-sm">Bleed tolerance</label>
                                <div class="col-sm-6 input-group-sm">
                                    <input class="form-control form-control-sm measure" name="BLEED" type="text"
                                        value="3" /><span
                                        class="input-group-text text-center suffix form-control-sm">mm</span>
                                    <span class="show-tooltip"
                                        title="Minimal amount of space between registration marks and models"
                                        data-bs-toggle="tooltip" data-bs-placement="top">?</span>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label class="col-sm-6 col-form-label form-control-sm">Overcut</label>
                                <div class="col-sm-6 input-group-sm">
                                    <input class="form-control form-control-sm measure" name="OVERCUT" type="text"
                                        value="0" /><span
                                        class="input-group-text text-center suffix form-control-sm">mm</span>
                                    <span class="show-tooltip"
                                        title="For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle"
                                        data-bs-toggle="tooltip" data-bs-placement="top">?</span>
                                </div>
                        </div>
                        <div class="row mb-3">
                            <label class="col-sm-6 col-form-label form-control-sm">Push-out Cut length</label>

                            <div class="col-sm-6 input-group-sm">
                                <input class="form-control form-control-sm measure" name="DASH" type="text"
                                    value="40" /><span
                                    class="input-group-text text-center suffix form-control-sm">mm</span>

                                <span class="show-tooltip"
                                    title="Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments)."
                                    data-bs-toggle="tooltip" data-bs-placement="top">?</span>

                            </div>

                        </div>
                        <div class="row mb-3">
                            <label class="col-sm-6 col-form-label form-control-sm">Push-out Bridge Length</label>

                            <div class="col-sm-6 input-group-sm">
                                <input class="form-control form-control-sm measure" name="GAP" type="text"
                                    value="0" /><span
                                    class="input-group-text text-center suffix form-control-sm">mm</span>

                                <span class="show-tooltip"
                                    title="Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments)."
                                    data-bs-toggle="tooltip" data-bs-placement="top">?</span>

                            </div>

                        </div>
                        <div class="row mb-3">
                            <label class="col-sm-6 col-form-label form-control-sm">Sharp corner radius</label>

                            <div class="col-sm-6 input-group-sm">
                                <input class="form-control form-control-sm measure" name="FILMIN" type="text"
                                    value="0" /><span
                                    class="input-group-text text-center suffix form-control-sm">mm</span>

                                <span class="show-tooltip" title="Minimal radius of sharp corners."
                                    data-bs-toggle="tooltip" data-bs-placement="top">?</span>

                            </div>

                        </div>
                    </fieldset>

                </div>

            </div>

            <div class="container-fluid">
                <div class="row">
                    <button type="submit" class="btn btn-sm btn-outline-primary btn-lg submit">Submit</button>
                </div>
            </div>
        </form>
    </div>
</div></template>