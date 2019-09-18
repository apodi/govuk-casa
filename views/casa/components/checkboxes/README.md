# `casaGovukCheckboxes()`

Extends the [`govukCheckboxes()`](https://design-system.service.gov.uk/components/checkboxes/) macro.

Note that for consistency, values gathered from this macro will always be an array. To accomplish this, under the hood the name of the field will always be automatically suffixed with `[]`, which is then parsed by the `body-parser` middleware as an array.

Custom parameters:

* `casaValue` (`array`) - the value of the chosen checkbox(es). This is a convenience for toggling the `checked` flag on the appropriate `item`, but you can also manually set `checked` on each item if you need to use more specific logic for determining checked state.
* `casaErrors` - form errors (just pass `formErrors`)


## Example usage

Basic example:

```nunjucks
{% from "casa/components/checkboxes/macro.njk" import casaGovukCheckboxes with context %}

casaGovukCheckboxes({
  name: "preferences",
  casaValue: formData.preferences,
  casaErrors: formErrors,
  fieldset: {
    legend: {
      text: "Choose your preferences",
      isPageHeading: true,
      classes: "govuk-fieldset__legend--xl"
    }
  },
  hint: {
    text: "Some instructive hints"
  },
  items: [{
    value: "twistedflax",
    text: "Twisted Flax"
  }, {
    value: "tworeeds",
    text: "Two Reeds"
  }, {
    value: "water",
    text: "Water"
  }, {
    value: "horus",
    text: "Horus"
  }]
})
```

To associate a checkbox item with a toggleable DOM element:

```nunjucks
{% from "casa/components/checkboxes/macro.njk" import casaGovukCheckboxes with context %}

{% set panel %}
  This panel will remain hidden until the "First Choice" option is checked
{% endset %}

casaGovukCheckboxes({
  name: "preferences",
  casaValue: formData.preferences,
  casaErrors: formErrors,
  items: [{
    value: "first-choice",
    text: "First Choice",
    conditional: {
      html: panel
    }
  }, {
    value: "second-choice",
    text: "Second Choice"
  }]
})
```

## Displaying errors

ref: https://design-system.service.gov.uk/components/error-summary/

The error summary link must set focus on the first checkbox in the group. Unless you have specified an explicit `id` for the first item in the list, this macro will explicitly set that `id` to `f-<name>`, e.g. `f-preferences` in order for links from the error summary to work as expected.
