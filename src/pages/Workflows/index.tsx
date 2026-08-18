import { useState } from 'react'
import { Plus, Edit2, Trash2, Users, FileText, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MOCK_DISPOSITIFS, MOCK_WORKFLOWS } from '@/mock'

export function WorkflowsPage() {
  const [activeTab, setActiveTab] = useState<string>(MOCK_DISPOSITIFS[0].id)
  
  const wf = MOCK_WORKFLOWS[activeTab]

  return (
    <div className="space-y-6">
      <style>{`
        .wf {
          position: relative;
          padding-left: 8px;
        }

        .wf .cy {
          position: relative;
          padding: 0 0 6px 40px;
          margin-bottom: 6px;
        }

        .wf .cy::before {
          content: "";
          position: absolute;
          left: 13px;
          top: 34px;
          bottom: -6px;
          width: 2px;
          background: #E5EAF1;
        }

        .wf .cy:last-child::before {
          display: none;
        }

        .wf .cy .num {
          position: absolute;
          left: 0;
          top: 2px;
          width: 28px;
          height: 28px;
          border-radius: 9px;
          background: #131C29;
          color: #fff;
          display: grid;
          place-items: center;
          font-weight: 700;
          font-size: 13px;
          z-index: 1;
        }

        .cyc-card {
          background: #FFFFFF;
          border: 1px solid #E5EAF1;
          border-radius: 7px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          overflow: hidden;
        }

        .cyc-card .ch {
          padding: 13px 16px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          row-gap: 8px;
          gap: 10px;
          cursor: default;
        }

        .cyc-card .ch h4 {
          font-size: 14px;
          font-weight: 700;
          color: #131C29;
        }

        .cyc-card .ch .code {
          font-size: 11px;
          color: #5A6B80;
          font-family: monospace;
        }

        .cyc-card .cb {
          padding: 0 16px 16px;
          border-top: 1px solid #EEF2F7;
        }

        .sub {
          border-left: 2px solid #EEF2F7;
          padding: 12px 0 4px 16px;
          margin: 14px 0 0;
        }

        .sub h5 {
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 6px;
          color: #131C29;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .meta {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        }

        .meta .m {
          font-size: 11.5px;
          background: #f4f6fa;
          border: 1px solid #EEF2F7;
          border-radius: 7px;
          padding: 4px 9px;
          color: #5A6B80;
          display: inline-flex;
          gap: 5px;
          align-items: center;
        }

        .meta .m b {
          color: #131C29;
          font-weight: 600;
        }
      `}</style>

      <div>
        <h1 className="text-2xl font-extrabold text-[#131C29]">Paramétrage des workflows</h1>
        <p className="text-sm text-[#5A6B80] mt-1">Configuration des étapes et sous-étapes de chaque guichet (réservé aux administrateurs).</p>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <div className="overflow-x-auto w-full no-scrollbar">
          <TabsList className="flex items-center gap-1 border-b border-slate-200 w-max min-w-full bg-transparent p-0 h-auto rounded-none justify-start">
            {MOCK_DISPOSITIFS.map(d => (
              <TabsTrigger 
                key={d.id} 
                value={d.id}
                className="!bg-transparent !shadow-none after:hidden px-4 py-2.5 text-[13.5px] font-semibold text-slate-500 border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B] hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none"
              >
                {d.libelle}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-6 outline-none">
          <div className="mb-6">
            <Button size="sm" className="bg-[#E7722B] hover:bg-[#C85E18] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une étape
            </Button>
          </div>

          <div className="wf max-w-[820px]">
            {wf.cycles.length === 0 ? (
              <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                Aucune étape configurée pour ce guichet.
              </div>
            ) : (
              wf.cycles.map((c: any, ci: number) => (
                <div key={ci} className="cy">
                  <div className="num">{c.n}</div>
                  <div className="cyc-card">
                    <div className="ch">
                      <div className="flex-1">
                        <h4>{c.t}</h4>
                        <div className="code">{c.code}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-[#131C29] hover:bg-slate-100 transition-colors" title="Modifier l'étape">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Supprimer l'étape">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="cb block">
                      {c.subs.length === 0 ? (
                        <div className="text-slate-500 text-sm py-2">Aucune sous-étape</div>
                      ) : (
                        c.subs.map((s: any, si: number) => (
                          <div key={si} className="sub">
                            <h5>
                              <span>{s.t}</span>
                              <span className="flex gap-1 flex-none">
                                <button className="flex items-center justify-center w-7 h-7 rounded text-slate-400 hover:text-[#131C29] hover:bg-slate-100 transition-colors" title="Modifier">
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button className="flex items-center justify-center w-7 h-7 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Supprimer">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </span>
                            </h5>
                            <div className="meta">
                              <span className="m">
                                <Users className="w-3.5 h-3.5" />
                                <b>{s.acteurs || '—'}</b>
                              </span>
                              {s.liv && (
                                <span className="m">
                                  <FileText className="w-3.5 h-3.5" />
                                  {s.liv}
                                </span>
                              )}
                              {s.delai && (
                                <span className="m">
                                  <Clock className="w-3.5 h-3.5" />
                                  {s.delai}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                      
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="h-8 text-xs font-medium text-slate-600">
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          Ajouter une sous-étape
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
