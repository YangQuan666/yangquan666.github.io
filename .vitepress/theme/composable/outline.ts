import {ref} from 'vue'
import {throttle} from "quasar"
import {DefaultTheme, Header} from "vitepress"

export const uniqueItemKey = ref<string>('')
export const currentPosition = ref(0)

export type MenuItem = Omit<Header, 'slug' | 'children'> & {
    children?: MenuItem[]
}

export function getHeaders(range: DefaultTheme.Config['outline']) {
    const headers = [
        ...document.querySelectorAll('.markdown-body :where(h1,h2,h3,h4,h5,h6)')
    ]
        .filter((el) => el.id && el.hasChildNodes())
        .map((el) => {
            const level = Number(el.tagName[1]);
            return {
                element: el,
                title: serializeHeader(el),
                link: '#' + el.id,
                level
            };
        });
    return resolveHeaders(headers, range);
}

function serializeHeader(h: Element): string {
    let ret = ''
    for (const node of h.childNodes) {
        if (node.nodeType === 1) {
            if (
                (node as Element).classList.contains('VPBadge') ||
                (node as Element).classList.contains('header-anchor')
            ) {
                continue
            }
            ret += node.textContent
        } else if (node.nodeType === 3) {
            ret += node.textContent
        }
    }
    return ret.trim()
}

export function resolveHeaders(
    headers: MenuItem[],
    range?: DefaultTheme.Config['outline']
): MenuItem[] {
    if (range === false) {
        return []
    }

    const levelsRange =
        (typeof range === 'object' && !Array.isArray(range)
            ? range.level
            : range) || 2

    const [high, low]: [number, number] =
        typeof levelsRange === 'number'
            ? [levelsRange, levelsRange]
            : levelsRange === 'deep'
                ? [2, 6]
                : levelsRange

    headers = headers.filter((h) => h.level >= high && h.level <= low)

    const ret: MenuItem[] = []
    outer: for (let i = 0; i < headers.length; i++) {
        const cur = headers[i]
        if (i === 0) {
            ret.push(cur)
        } else {
            for (let j = i - 1; j >= 0; j--) {
                const prev = headers[j]
                if (prev.level < cur.level) {
                    ;(prev.children || (prev.children = [])).push(cur)
                    continue outer
                }
            }
            ret.push(cur)
        }
    }

    return ret
}

export function isActivate(path: string, link: string) {
    return path.concat(link) === uniqueItemKey.value
}

export function onScroll(pos: number) {
    currentPosition.value = pos
    // console.log(currentPosition.value)
}

export const throttleOnScroll = throttle(onScroll, 500)
