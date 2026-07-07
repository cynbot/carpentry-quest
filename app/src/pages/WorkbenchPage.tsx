export function WorkbenchPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-8 bg-heartwood rounded-full" />
        <h2 className="text-3xl font-bold">The Workbench</h2>
      </div>
      <p className="text-metallic mb-6">Phase 4 — a promise, written down.</p>

      <div className="card space-y-4">
        <div className="text-5xl text-center py-6">🛠️ ✶ 🧑</div>
        <p className="text-white">
          A 3D space where we snap boards, panels, and dowels together and prototype
          things — a fold-flat picnic table, a toy chest with a seating nook — before
          any wood is cut.
        </p>
        <p className="text-metallic">
          The trick that makes it more than a toy: every placed part is <em>parametric</em>
          (dimensions + material + role, not just a mesh), and the assembly is a regular
          Heartwood project. So the moment something stands up in 3D, its cut list and
          shopping list already exist — same document, different views. And because the
          document is plain JSON, a Claude can place parts in it too: co-building,
          asynchronously, no special infrastructure.
        </p>
        <div className="bg-gray-900 rounded-lg p-4 text-sm text-metallic space-y-1">
          <p className="text-sand font-semibold">Engineering notes (researched July 2026):</p>
          <p>· Stack: @react-three/fiber 9.6.x + drei 10.7.x + zustand — pinned stable, WebGPU later</p>
          <p>· MVP: axis-aligned parts snapping on a real-unit grid; face-flush before fancy anchors</p>
          <p>· Deferred: physics, CSG joinery visuals, realtime multiplayer — none needed for v1</p>
          <p>· Prior art: Morti (parametric furniture → cutlist), OpenCutList's part typing</p>
          <p>· Mobile: explicit navigate-vs-move toggle; save format is the JSON document, never scenes</p>
        </div>
      </div>
    </div>
  );
}
