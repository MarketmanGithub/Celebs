import { useEffect, useState } from 'react';
import { getAllCelebs, resetCelebs } from '../api/celebApi';
import type { Celeb } from '../models/celeb';
import CelebCard from '../components/CelebCard';
import CelebToolbar from '../components/CelebToolbar';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import config from '../config';


export default function ListCelebsPage() {
  const [celebs, setCelebs] = useState<Celeb[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(config.defaultViewMode as 'grid' | 'list');
  const [sortBy] = useState<'name' | 'gender' | 'date'>(config.defaultSortBy as 'name' | 'gender' | 'date');


  const fetchCelebs = () => {
    setLoading(true);
    getAllCelebs(sortBy)
      .then(setCelebs)
      .catch((err) => console.error('Failed to load celebs:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let active = true;
    getAllCelebs(sortBy)
      .then((data) => {
        if (active) setCelebs(data);
      })
      .catch((err) => console.error('Failed to load celebs:', err))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [sortBy]);

  useEffect(() => {
    document.title = config.appName;
  }, []);

  const handleReset = async () => {
    await resetCelebs();
    fetchCelebs();
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(celebs);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setCelebs(reordered);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1
        className="text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg tracking-wide"
        style={{ letterSpacing: '0.05em' }}
      >
        {config.appName}
      </h1>
      <CelebToolbar
        viewMode={viewMode}
        onToggleView={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        onReset={handleReset}
      />
      {config.enableDragAndDrop ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="celebs" direction={viewMode === 'grid' ? 'horizontal' : 'vertical'}>
            {(provided) => (
              <div
                className={
                  viewMode === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center"
                    : "flex flex-col flex-wrap gap-2"
                }
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {celebs.map((celeb, index) => (
                  <Draggable key={celeb.id} draggableId={celeb.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <CelebCard celeb={celeb} onDelete={fetchCelebs} viewMode={viewMode} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center"
              : "flex flex-col flex-wrap gap-2"
          }
        >
          {celebs.map((celeb) => (
            <CelebCard key={celeb.id} celeb={celeb} onDelete={fetchCelebs} viewMode={viewMode} />
          ))}
        </div>
      )}
      <footer className="text-center text-gray-400 py-4">
        &copy; {new Date().getFullYear()} {config.appName}
      </footer>
    </div>
  );
}