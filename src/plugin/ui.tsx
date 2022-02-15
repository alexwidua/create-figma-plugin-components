import { Button, render, useWindowResize } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { h, RefObject } from 'preact'
import { useRef, useState } from 'preact/hooks'

import { Panel } from './../components/Panel/panel'

function Plugin() {
	function onWindowResize(windowSize: { width: number; height: number }) {
		emit('RESIZE_WINDOW', windowSize)
	}
	useWindowResize(onWindowResize, {
		maxHeight: 820,
		maxWidth: 820,
		minHeight: 120,
		minWidth: 120
	})

	const containerRef: RefObject<HTMLDivElement> = useRef(null)
	const buttonRef: RefObject<HTMLDivElement> = useRef(null)
	const [panelOpen, setPanelOpen] = useState(false)

	return (
		<div
			ref={containerRef}
			style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
			<Panel
				anchorRef={buttonRef}
				boundsRef={containerRef}
				onClose={() => setPanelOpen(false)}
				anchorAlign="RIGHT"
				open={panelOpen}>
				<div style={{ background: 'red', width: 200 }} />
			</Panel>
			<div
				ref={buttonRef}
				style={{
					position: 'absolute',
					bottom: '50%',
					right: '10%',
					transform: 'translate3d(50%,50%,0)'
				}}>
				<Button onClick={() => setPanelOpen((prev) => !prev)}>
					Open Panel
				</Button>
			</div>
		</div>
	)
}

export default render(Plugin)
