import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmojiTile } from "@/components/ui/EmojiTile";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { GraphNode } from "@/types";

interface ExploreGraphProps {
  nodes: GraphNode[];
}

function GraphNodeView({ node }: { node: GraphNode }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(`/search?${new URLSearchParams({ q: node.name })}`)}
      className="group flex w-28 shrink-0 cursor-pointer flex-col items-center gap-2 text-center"
    >
      <EmojiTile
        emoji={node.emoji}
        accent={node.accent}
        size="lg"
        className="ring-4 ring-white shadow-card transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-105"
      />
      <span>
        <span className="block text-xs leading-tight font-semibold text-slate-800">
          {node.name}
        </span>
        <span className="mt-0.5 block text-[10px] font-medium text-slate-400">
          {node.type}
        </span>
      </span>
    </button>
  );
}

function Connector() {
  return (
    <span className="relative mt-7 h-px min-w-6 flex-1 bg-slate-200" aria-hidden>
      <ChevronRight className="absolute top-1/2 left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 bg-white text-slate-300" />
    </span>
  );
}

/** Static relationship chain showing how entities connect across Raayo. */
export function ExploreGraph({ nodes }: ExploreGraphProps) {
  return (
    <section className="anim-rise">
      <SectionHeader
        variant="title"
        title="Explore the Graph"
        subtitle="How people, events and organizations connect"
        className="mb-3.5"
      />
      <Card className="flex items-start overflow-x-auto px-6 py-5">
        {nodes.map((node, index) => (
          <Fragment key={node.id}>
            {index > 0 && <Connector />}
            <GraphNodeView node={node} />
          </Fragment>
        ))}
      </Card>
    </section>
  );
}
