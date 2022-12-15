
import container from './markdownitContainer'

export function renderMarkdown(md) {
        const tocData = []

        extendBlockQuote(md)
        extendHeading(md, tocData)
        extendImage(md)
        extendLink(md, {})
        extendTable(md)
        extendToken(md)

        extendContainers(md)

        // extendFenceLineNumbers(md, allProps.value.lineNumberAlt)

        // handle disabled rules
        // const disabled = []
        // if (!__isEnabled(allProps.value.noImage)) {
        //     disabled.push('image')
        // }
        // if (!__isEnabled(allProps.value.noLink)) {
        //     disabled.push('link')
        // }
        // if (!__isEnabled(allProps.value.noBlockquote)) {
        //     disabled.push('blockquote')
        // }
        // if (disabled.length > 0) {
        //     md.disable(disabled)
        // }
        //
        // if (allProps.value.plugins.length > 0) {
        //     allProps.value.plugins.forEach(plugin => {
        //         if (plugin instanceof Function) {
        //             md.use(plugin)
        //         }
        //         else {
        //             if (plugin.plugin instanceof Function && plugin.options) {
        //                 md.use(plugin.plugin, plugin.options)
        //             }
        //         }
        //     })
        // }

        // rendered.value = md.render(markdown)

        // if (allProps.value.toc && tocData.length > 0) {
        //     emit('data', tocData)
        // }
    //
    // const renderedMarkdown = h('div', {
    //     ref: markdownRef,
    //     class: [
    //         'q-markdown',
    //         allProps.value.contentClass
    //     ],
    //     style: allProps.value.contentStyle,
    //     innerHTML: rendered.value
    // })

    // const renderedCopyWrapper = h('div', {
    //     style: {
    //         position: 'relative'
    //     }
    // }, [
    //     renderedMarkdown,
    //     __renderCopy()
    // ])

    // return allProps.value.showCopy !== true ? renderedMarkdown : renderedCopyWrapper
    // function __isEnabled (val) {
    //     return val === void 0 || val === false
    // }
}

function extendBlockQuote (md) {
    md.renderer.rules.blockquote_open = (tokens, idx, options, env, self) => {
        const token = tokens[ idx ]

        token.attrSet('class', 'q-markdown--note')
        return self.renderToken(tokens, idx, options)
    }
}

function extendContainers (md) {
    md.use(...createContainer('info', 'INFO'))
    md.use(...createContainer('tip', 'TIP'))
    md.use(...createContainer('warning', 'WARNING'))
    md.use(...createContainer('danger', 'IMPORTANT'))
    md.use(...createContainer('', ''))

    // explicitly escape Vue syntax
    md.use(container, 'v-pre', {
        render: (tokens, idx) => (tokens[ idx ].nesting === 1
            ? '<div v-pre>\n'
            : '</div>\n')
    })
}

function createContainer (className, defaultTitle) {
    return [
        container,
        className,
        {
            render (tokens, idx) {
                const token = tokens[ idx ]
                const info = token.info.trim().slice(className.length).trim()
                if (token.nesting === 1) {
                    return `<div class="q-markdown--note q-markdown--note--${ className }"><p class="q-markdown--note-title">${ info || defaultTitle }</p>\n`
                }
                else {
                    return '</div>\n'
                }
            }
        }
    ]
}

function unemoji (TokenConstructor, token) {
    if (token.type === 'emoji') {
        return Object.assign(new TokenConstructor(), token, { content: token.markup })
    }
    return token
}

function extendHeading (md, tocData = [], toc = false, tocStart = 1, tocEnd = 3, noHeadingAnchorLinks = false) {
    let Token
    md.core.ruler.push('headingLinks', function (state) {
        // save the Token constructor because we'll be building a few instances at render
        // time; that's sort of outside the intended markdown-it parsing sequence, but
        // since we have tight control over what we're creating (a link), we're safe
        if (!Token) {
            Token = state.Token
        }
    })

    md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
        const token = tokens[ idx ]

        // get the token number
        const tokenNumber = parseInt(token.tag[ 1 ])

        const children = tokens[ idx + 1 ]
            .children

        const label = children
            .reduce((acc, t) => acc + t.content, '')

        const classes = []
        classes.push('q-markdown--heading')
        classes.push(`q-markdown--heading-${ token.tag }`)

        if (token.markup === '=') {
            classes.push('q-markdown--title-heavy')
        }
        else if (token.markup === '-') {
            classes.push('q-markdown--title-light')
        }

        if (noHeadingAnchorLinks !== true && tocStart && tocEnd && tocStart <= tocEnd && tokenNumber >= tocStart && tokenNumber <= tocEnd) {
            classes.push('q-markdown--heading--anchor-link')
        }

        const unemojiWithToken = unemoji.bind(null, Token)
        const renderedLabel = md.renderer.renderInline(children.map(unemojiWithToken), options, env)

        const id = slugify(renderedLabel
            .replace(/[<>]/g, '') // In case the heading contains `<stuff>`
            .toLowerCase() // should be lowercase
        )

        token.attrSet('id', id)
        token.attrSet('name', id)
        token.attrSet('class', classes.join(' '))

        if (toc) {
            if (tocStart && tocEnd && tocStart <= tocEnd && tokenNumber >= tocStart && tokenNumber <= tocEnd) {
                tocData.push({ id: id, label: label, level: tokenNumber, children: [] })
            }
        }

        if (noHeadingAnchorLinks !== true && tokenNumber <= tocEnd) {
            // add 3 new token objects link_open, text, link_close
            const linkOpen = new Token('link_open', 'a', 1)
            const text = new Token('html_inline', '', 0)
            if (options.enableHeadingLinkIcons) {
                text.content = options.linkIcon
            }
            text.content = label

            const linkClose = new Token('link_close', 'a', -1)

            // add some link attributes
            // linkOpen.attrSet('id', id)
            // linkOpen.attrSet('class', '')
            linkOpen.attrSet('href', '#' + id)
            linkOpen.attrSet('aria-hidden', 'true')

            // remove previous children
            while (children.length > 0) children.pop()

            // add new token objects as children of heading
            children.unshift(linkClose)
            children.unshift(text)
            children.unshift(linkOpen)

            return md.renderer.renderToken(tokens, idx, options, env, self)
        }

        return self.renderToken(tokens, idx, options)
    }
}

function extendImage (md) {
    md.renderer.rules.image = (tokens, idx, options, env, self) => {
        const token = tokens[ idx ]

        token.attrSet('class', 'q-markdown--image')
        return self.renderToken(tokens, idx, options)
    }
}

function extendLink (md, { noopener = true, noreferrer = true }) {
    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
        const token = tokens[ idx ]

        const hrefIndex = token.attrIndex('href')

        if (token.attrs[ hrefIndex ][ 1 ][ 0 ] === '#') {
            if (typeof location !== 'undefined') {
                token.attrs[ hrefIndex ][ 1 ] = location.pathname + token.attrs[ hrefIndex ][ 1 ]
            }
        }

        if (token.attrs[ hrefIndex ][ 1 ] === '') {
            token.attrSet('class', 'q-markdown--link q-markdown--link-local')
            if (tokens[ idx + 1 ] && tokens[ idx + 1 ].type === 'text' && tokens[ idx + 1 ].content) {
                token.attrSet('id', slugify(tokens[ idx + 1 ].content))
            }
        }
        else if (token.attrs[ hrefIndex ][ 1 ][ 0 ] === '/'
            || token.attrs[ hrefIndex ][ 1 ].startsWith('..')) {
            token.attrSet('class', 'q-markdown--link q-markdown--link-local')
        }
        else {
            token.attrSet('class', 'q-markdown--link q-markdown--link-external')
            token.attrSet('target', '_blank')
            if (noopener === true || noreferrer === true) {
                const rel = []
                noopener === true && rel.push('noopener')
                noreferrer === true && rel.push('noreferrer')
                token.attrSet('rel', rel.join(' '))
            }
        }

        return self.renderToken(tokens, idx, options)
    }
}

function extendTable (md) {
    md.renderer.rules.table_open = (tokens, idx, options, env, self) => {
        const token = tokens[ idx ]

        token.attrSet('class', 'q-markdown--table')

        return self.renderToken(tokens, idx, options)
    }
}

function extendToken (md) {
    const defaultRender = md.renderer.rules.code_inline

    md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
        const token = tokens[ idx ]

        token.attrSet('class', 'q-markdown--token')
        return defaultRender(tokens, idx, options, env, self)
    }
}

function containerPlugin (md, name, options) {
    function validateDefault (params) {
        return params.trim().split(' ', 2)[ 0 ] === name
    }

    function renderDefault (tokens, idx, _options, env, self) {
        // add a class to the opening tag
        if (tokens[ idx ].nesting === 1) {
            tokens[ idx ].attrPush([ 'class', name ])
        }

        return self.renderToken(tokens, idx, _options, env, self)
    }

    options = options || {}

    const minMarkers = 3,
        markerStr = options.marker || ':',
        markerChar = markerStr.charCodeAt(0),
        markerLen = markerStr.length,
        validate = options.validate || validateDefault,
        render = options.render || renderDefault

    function container (state, startLine, endLine, silent) {
        let pos, nextLine, token,
            autoClosed = false,
            start = state.bMarks[ startLine ] + state.tShift[ startLine ],
            max = state.eMarks[ startLine ]

        // Check out the first character quickly,
        // this should filter out most of non-containers
        //
        if (markerChar !== state.src.charCodeAt(start)) { return false }

        // Check out the rest of the marker string
        //
        for (pos = start + 1; pos <= max; pos++) {
            if (markerStr[ (pos - start) % markerLen ] !== state.src[ pos ]) {
                break
            }
        }

        const markerCount = Math.floor((pos - start) / markerLen)
        if (markerCount < minMarkers) { return false }
        pos -= (pos - start) % markerLen

        const markup = state.src.slice(start, pos)
        const params = state.src.slice(pos, max)
        if (!validate(params)) { return false }

        // Since start is found, we can report success here in validation mode
        //
        if (silent) { return true }

        // Search for the end of the block
        //
        nextLine = startLine

        for (;;) {
            nextLine++
            if (nextLine >= endLine) {
                // unclosed block should be autoclosed by end of document.
                // also block seems to be autoclosed by end of parent
                break
            }

            start = state.bMarks[ nextLine ] + state.tShift[ nextLine ]
            max = state.eMarks[ nextLine ]

            if (start < max && state.sCount[ nextLine ] < state.blkIndent) {
                // non-empty line with negative indent should stop the list:
                // - ```
                //  test
                break
            }

            if (markerChar !== state.src.charCodeAt(start)) { continue }

            if (state.sCount[ nextLine ] - state.blkIndent >= 4) {
                // closing fence should be indented less than 4 spaces
                continue
            }

            for (pos = start + 1; pos <= max; pos++) {
                if (markerStr[ (pos - start) % markerLen ] !== state.src[ pos ]) {
                    break
                }
            }

            // closing code fence must be at least as long as the opening one
            if (Math.floor((pos - start) / markerLen) < markerCount) { continue }

            // make sure tail has spaces only
            pos -= (pos - start) % markerLen
            pos = state.skipSpaces(pos)

            if (pos < max) { continue }

            // found!
            autoClosed = true
            break
        }

        const oldParent = state.parentType
        const oldLineMax = state.lineMax
        state.parentType = 'container'

        // this will prevent lazy continuations from ever going past our end marker
        state.lineMax = nextLine

        token = state.push('container_' + name + '_open', 'div', 1)
        token.markup = markup
        token.block = true
        token.info = params
        token.map = [ startLine, nextLine ]

        state.md.block.tokenize(state, startLine + 1, nextLine)

        token = state.push('container_' + name + '_close', 'div', -1)
        token.markup = state.src.slice(start, pos)
        token.block = true

        state.parentType = oldParent
        state.lineMax = oldLineMax
        state.line = nextLine + (autoClosed ? 1 : 0)

        return true
    }

    md.block.ruler.before('fence', 'container_' + name, container, {
        alt: [ 'paragraph', 'reference', 'blockquote', 'list' ]
    })
    md.renderer.rules[ 'container_' + name + '_open' ] = render
    md.renderer.rules[ 'container_' + name + '_close' ] = render
};

function slugify (str) {
    return encodeURIComponent(String(str).trim().replace(/\s+/g, '-'))
}
function prismHighlight (Prism, str, lang) {
    if (lang === '') {
        lang = 'js' // default language
    }
    else if (lang === 'vue') {
        lang = 'html'
    }

    if (Prism.languages[ lang ] !== void 0) {
        const code = Prism.highlight(str, Prism.languages[ lang ], lang)

        return `<pre class="q-markdown--code q-markdown--code__inner language-${ lang }">`
            + `<code>${ code }</code></pre>\n`
    }

    return ''
}