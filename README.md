# Webyarns specific Reveal

This is fork of https://revealjs.com/ (version 3.8.x)

**documentation is work in progress**

## Navigation

### Disable keyboard `data-disable-keyboard`

Setup: Use `disableKeyboardSupport` from `webyarns-utils.js` for the  `keyboardCondition` Reveal configuration property

```html
<script src="webyarns-util/lib/webyarns-utils.js"></script>

<script>
    Reveal.initialize({
        keyboardCondition: disableKeyboardSupport,
        dependencies: [ … ],
    });
</script>
```

Then use `data-disable-keyboard` to disable keyboard navigation on a particular slide

```html
<section data-disable-keyboard>
    
</section>
```

Demo [webyarns-disable-keyboard.html](./webyarns-disable-keyboard.html)


