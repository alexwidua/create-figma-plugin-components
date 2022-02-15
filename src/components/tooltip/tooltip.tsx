import { h, ComponentChildren } from 'preact'
import { createClassName } from '@create-figma-plugin/ui'
import styles from './tooltip.css'

export type Alignment =
	| 'left'
	| 'topLeft'
	| 'top'
	| 'topRight'
	| 'right'
	| 'bottomRight'
	| 'bottom'
	| 'bottomLeft'

export type TooltipValue = {
	text: string
	children: ComponentChildren
}

export interface TooltipProps {
	value: TooltipValue
	alignment?: Alignment
	delay: number
}

export function Tooltip({
	value,
	alignment = 'top',
	delay = 0.2,
	...rest
}: TooltipProps) {
	return (
		<span className={styles.tooltip} {...rest}>
			{value.text}
			<span
				className={createClassName([styles.text, styles[alignment]])}
				style={{ transitionDelay: `${delay}s` }}>
				{value.children}
			</span>
		</span>
	)
}
