import { h, ComponentChildren, RefObject } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import { useDrag } from '@use-gesture/react'
import { useSpring, animated } from '@react-spring/web'
import { Text, IconButton, IconCross32 } from '@create-figma-plugin/ui'
import styles from './panel.css'

interface PanelProps {
	open: boolean
	title?: string
	children: ComponentChildren
	boundsRef: RefObject<HTMLDivElement>
	anchorRef: RefObject<HTMLDivElement>
	anchorMargin?: number
	onClose: () => void
}

export function Panel({
	open,
	title = 'Options',
	boundsRef,
	anchorRef,
	anchorMargin = 8,
	onClose,
	children
}: PanelProps) {
	const panelRef = useRef<HTMLDivElement>(null)

	/**
	 * Spawn panel above anchorRef element
	 */
	useEffect(() => {
		if (!anchorRef?.current || !panelRef?.current) return
		const rect = anchorRef.current.getBoundingClientRect()
		const panelRect = panelRef.current.getBoundingClientRect()
		animate.set({
			x: rect.x + panelRect.width - window.innerWidth,
			y: rect.y - window.innerHeight - anchorMargin
		})
	}, [panelRef, open])

	const [{ x, y }, animate] = useSpring(() => ({ x: 0, y: 0 }))
	const drag = useDrag(
		({ offset: [ox, oy] }) => {
			animate.set({ x: ox, y: oy })
		},
		{
			bounds: boundsRef,
			from: () => [x.get(), y.get()]
		}
	)

	/**
	 * Keep panel in bounds when plugin window is resizeable
	 */
	const [boundsRect, setBoundsRect] = useState({ width: 0, height: 0 })
	useEffect(() => {
		const handleResize = () => {
			if (!boundsRef?.current) return
			const rect = boundsRef.current.getBoundingClientRect()
			setBoundsRect({ width: rect.width, height: rect.height })
		}
		window.addEventListener('resize', handleResize)
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])
	useEffect(() => {
		if (!panelRef.current || !boundsRect.width || !boundsRect.height) return

		const panelRect = panelRef.current.getBoundingClientRect()
		const outOfBoundsX =
			Math.abs(x.get() - panelRect.width) > window.innerWidth
		const outOfBoundsY =
			Math.abs(y.get() - panelRect.height) > window.innerHeight

		animate.set({
			x: outOfBoundsX ? 0 - window.innerWidth + panelRect.width : x.get(),
			y: outOfBoundsY
				? 0 - window.innerHeight + panelRect.height
				: y.get()
		})
	}, [boundsRect])

	return (
		<animated.div
			className={`
			${styles.panel} 
			${open ? styles.open : undefined}
			`}
			style={{ x, y }}
			ref={panelRef}
			{...drag()}>
			<div className={styles.titlebar}>
				<Text bold style={{ marginRight: 'var(--space-extra-small)' }}>
					{title}
				</Text>
				<IconButton onChange={onClose} value={false}>
					<IconCross32 />
				</IconButton>
			</div>
			{children}
		</animated.div>
	)
}
