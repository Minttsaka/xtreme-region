"use client"

import * as React from "react"
import {
  highlightPlugin,
  type HighlightArea,
  MessageIcon,
  type RenderHighlightContentProps,
  type RenderHighlightsProps,
  type RenderHighlightTargetProps,
} from "@react-pdf-viewer/highlight"
import {
  Position,
  Tooltip,
  Viewer,
  SpecialZoomLevel,
  type DocumentLoadEvent,
  type PageChangeEvent,
  CharacterMap,
  ProgressBar,
  Worker
} from "@react-pdf-viewer/core"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import { bookmarkPlugin } from '@react-pdf-viewer/bookmark';
import '@react-pdf-viewer/bookmark/lib/styles/index.css';
import { zoomPlugin} from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import { MoreIcon, toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import { RenderShowSearchPopoverProps, searchPlugin } from '@react-pdf-viewer/search';
import '@react-pdf-viewer/search/lib/styles/index.css';
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Bookmark, } from "lucide-react"
import { Textarea } from "../ui/textarea"
import { ScrollArea } from "../ui/scroll-area"
import { Button } from "../ui/button"

interface Note {
  id: number
  content: string
  highlightAreas: HighlightArea[]
  quote: string
  color: string
}

interface PDFViewerProps {
  file: string
  onHighlight: (highlight: Note) => void
  highlights: Note[]
}

const colorPalette = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#F7B731",
  "#6C5CE7",
  "#26de81",
  "#fd9644",
  "#a55eea",
  "#54a0ff",
  "#5f27cd",
]

export default function PDFViewer({ file, onHighlight, highlights: initialHighlights }: PDFViewerProps) {
  const [message, setMessage] = React.useState("")
  const [notes, setNotes] = React.useState<Note[]>(initialHighlights)
  const [currentPage, setCurrentPage] = React.useState(0)
  const [totalPages, setTotalPages] = React.useState(0)
  const [scale, setScale] = React.useState<number | SpecialZoomLevel>(SpecialZoomLevel.PageFit)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)

  React.useEffect(()=>{
    setIsSearchOpen(false)
    setScale(SpecialZoomLevel.PageFit)
  },[])

  let noteId = notes.length

  const noteEles: Map<number, HTMLElement> = new Map()

  const characterMap: CharacterMap = {
    isCompressed: true,
    // The url has to end with "/"
    url: 'https://unpkg.com/pdfjs-dist@2.6.347/cmaps/',
};

const bookmarkPluginInstance = bookmarkPlugin();

const zoomPluginInstance = zoomPlugin();

const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

const toolbarPluginInstance = toolbarPlugin();

const searchPluginInstance = searchPlugin();
const { ShowSearchPopover } = searchPluginInstance;

  const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-full shadow-lg absolute z-10"
      style={{
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
      }}
    >
      <Tooltip
        position={Position.TopCenter}
        target={
          <Button onClick={props.toggle} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MessageIcon />
          </Button>
        }
        content={() => <div className="bg-black text-white px-2 py-1 rounded text-sm">Add a note</div>}
        offset={{ left: 0, top: -8 }}
      />
    </motion.div>
  )

  const renderHighlightContent = (props: RenderHighlightContentProps) => {
    const addNote = () => {
      if (message !== "") {
        const note: Note = {
          id: ++noteId,
          content: message,
          highlightAreas: props.highlightAreas,
          quote: props.selectedText,
          color: colorPalette[noteId % colorPalette.length],
        }
        setNotes(notes.concat([note]))
        onHighlight(note)
        setMessage("")
        props.cancel()
      }
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl p-4 absolute z-20"
        style={{
          left: `${props.selectionRegion.left}%`,
          top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
          width: "300px",
        }}
      >
        <Textarea
          rows={3}
          className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add your note here..."
        />
        <div className="flex justify-between mt-4">
          <Button onClick={props.cancel} className="text-gray-600 hover:text-gray-800">
            Cancel
          </Button>
          <Button
            onClick={addNote}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Add Note
          </Button>
        </div>
      </motion.div>
    )
  }

  const jumpToNote = (note: Note) => {
    if (noteEles.has(note.id)) {
      noteEles.get(note.id)?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const renderHighlights = (props: RenderHighlightsProps) => (
    <div>
      {notes.map((note) => (
        <React.Fragment key={note.id}>
          {note.highlightAreas
            .filter((area) => area.pageIndex === props.pageIndex)
            .map((area, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                whileHover={{ opacity: 0.6 }}
                className="cursor-pointer"
                style={{
                  ...props.getCssProperties(area, props.rotation),
                  backgroundColor: note.color,
                }}
                onClick={() => jumpToNote(note)}
                ref={(ref): void => {
                  noteEles.set(note.id, ref as HTMLElement)
                }}
              />
            ))}
        </React.Fragment>
      ))}
    </div>
  )

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
    renderHighlightContent,
    renderHighlights,
  })

  const { jumpToHighlightArea } = highlightPluginInstance

  const handleDocumentLoad = (e: DocumentLoadEvent) => {
    setTotalPages(e.doc.numPages)
  }

  const handlePageChange = (e: PageChangeEvent) => {
    setCurrentPage(e.currentPage)
  }

  // const handleZoomIn = () => {
  //   setScale((prevScale) => {
  //     if (typeof prevScale === "number") {
  //       return prevScale + 0.1
  //     }
  //     return 1.1
  //   })
  // }

  // const handleZoomOut = () => {
  //   setScale((prevScale) => {
  //     if (typeof prevScale === "number") {
  //       return Math.max(0.1, prevScale - 0.1)
  //     }
  //     return 0.9
  //   })
  // }

  return (
    <div className="flex h-screen bg-gray-100">
      <motion.div
        initial={{ width: "25%" }}
        animate={{ width: notes.length > 0 ? "25%" : "0%" }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-lg overflow-hidden"
      >
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Notes</h2>
          <p className="text-sm text-gray-600 mt-1">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </p>
        </div>
        <ScrollArea className="h-full">
          <AnimatePresence>
            {notes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center p-8"
              >
                <p className="text-gray-500">No notes yet. Highlight text to add notes.</p>
              </motion.div>
            ) : (
              notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white border-b border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => jumpToHighlightArea(note.highlightAreas[0])}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: note.color }}></div>
                    <span className="text-xs text-gray-500">Page {note.highlightAreas[0].pageIndex + 1}</span>
                  </div>
                  <blockquote className="text-sm italic text-gray-600 mb-2">{note.quote}</blockquote>
                  <p className="text-gray-800">{note.content}</p>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </ScrollArea>
      </motion.div>
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-md p-4 flex justify-between items-center">
          <div style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            padding: '4px',
        }}
        className="flex items-center space-x-4">
          <ZoomOutButton />
          <ZoomPopover />
          <ZoomInButton />
            <span className="text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>
          </div>
          <MoreIcon />
          <div className="flex items-center space-x-4">
          <ShowSearchPopover>
            {(props: RenderShowSearchPopoverProps) => (
                <button
                className="bg-blue-500 p-2 text-white rounded-2xl"
                    style={{
                        backgroundColor: '#357edd',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#ffffff',
                        cursor: 'pointer',
                        padding: '8px',
                    }}
                    onClick={props.onClick}
                >
                    Search
                </button>
            )}
        </ShowSearchPopover>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Bookmark size={20} />
            </button>
          </div>
        </div>
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white shadow-md p-4"
            >
              <input
                type="text"
                placeholder="Search in document..."
                className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <ScrollArea className="flex-1 overflow-hidden">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer
              characterMap={characterMap}
              fileUrl={file}
               theme='auto'
              plugins={[highlightPluginInstance,searchPluginInstance, bookmarkPluginInstance, zoomPluginInstance,toolbarPluginInstance]}
              onDocumentLoad={handleDocumentLoad}
              onPageChange={handlePageChange}
              defaultScale={scale}
              renderLoader={(percentages: number) => (
                <div style={{ width: '240px' }}>
                    <ProgressBar progress={Math.round(percentages)} />
                </div>
               
            )}
            />
          </Worker>
        </ScrollArea>
        <div className="bg-white shadow-md p-4 flex justify-center items-center space-x-4">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

