const { createApp, defineComponent, reactive, ref } = Vue;

// Sample data
const server_data = {
    collection: {
        title: "Movie List",
        type: "movie",
        version: "1.0",

        items: [
            {
                href: "https://en.wikipedia.org/wiki/The_Lord_of_the_Rings_(film_series)",
                data: [
                    { name: "name", value: "The Lord of the Rings", prompt: "Name" },
                    { name: "description", value: "The Lord of the Rings is a film series consisting of three high fantasy adventure films directed by Peter Jackson. They are based on the novel The Lord of the Rings by J. R. R. Tolkien. The films are subtitled The Fellowship of the Ring (2001), The Two Towers (2002) and The Return of the King (2003). They are a New Zealand-American venture produced by WingNut Films and The Saul Zaentz Company and distributed by New Line Cinema.", prompt: "Description" },
                    { name: "director", value: "Peter Jackson", prompt: "Director" },
                    { name: "datePublished", value: "2001-12-19", prompt: "Release Date" }
                ]
            },
            {
                href: "https://en.wikipedia.org/wiki/The_Hunger_Games_(film_series)",
                data: [
                    { name: "name", value: "The Hunger Games", prompt: "Name" },
                    { name: "description", value: "The Hunger Games film series consists of four science fiction dystopian adventure films based on The Hunger Games trilogy of novels, by the American author Suzanne Collins. Distributed by Lionsgate and produced by Nina Jacobson and Jon Kilik, it stars Jennifer Lawrence as Katniss Everdeen, Josh Hutcherson as Peeta Mellark, Woody Harrelson as Haymitch Abernathy, Elizabeth Banks as Effie Trinket, Philip Seymour Hoffman as Plutarch Heavensbee, Stanley Tucci as Caesar Flickerman, Donald Sutherland as President Snow, and Liam Hemsworth as Gale Hawthorne. Gary Ross directed the first film, while Francis Lawrence directed the next three films.", prompt: "Description" },
                    { name: "director", value: "Gary Ross", prompt: "Director" },
                    { name: "datePublished", value: "2012-03-12", prompt: "Release Date" }
                ]
            },
            {
                href: "https://en.wikipedia.org/wiki/Game_of_Thrones",
                data: [
                    { name: "name", value: "Game of Thrones", prompt: "Name" },
                    { name: "description", value: "Game of Thrones is an American fantasy drama television series created by David Benioff and D. B. Weiss. It is an adaptation of A Song of Ice and Fire, George R. R. Martin's series of fantasy novels, the first of which is A Game of Thrones. It is filmed in Belfast and elsewhere in the United Kingdom, Canada, Croatia, Iceland, Malta, Morocco, Spain, and the United States. The series premiered on HBO in the United States on April 17, 2011, and its seventh season ended on August 27, 2017. The series will conclude with its eighth season premiering in 2019.", prompt: "Description" },
                    { name: "director", value: "Alan Taylor et al", prompt: "Director" },
                    { name: "datePublished", value: "2011-04-17", prompt: "Release Date" }
                ]
            }
        ]
    }
};

// ---------------------------------------------------------------------------
// Componente edit-form
// Este componente muestra un formulario de edición para los datos del ítem.
// Cada campo se genera a partir del array 'itemdata', y se asigna un id único usando el
// índice del ítem (prop index) y el nombre del campo.
// ---------------------------------------------------------------------------
const EditForm = defineComponent({
props: {
    itemdata: {
    type: Array,
    required: true
    },
    index: {
    type: Number,
    required: false
    }
},
emits: ['formClosed'],
setup(props, { emit }) {

    // Método para cerrar el formulario que emite el evento 'formClosed'
    const closeForm = () => {
    emit('formClosed');
    };
    return { closeForm };
},
template: `
<div>
    <h2>Edit Form</h2>
    <form>
    <div v-for="(field, i) in itemdata" :key="i" class="mb-3">
        <label :for="'input-' + index + '-' + field.name" class="form-label">{{ field.prompt }}</label>
        <input type="text" class="form-control" :id="'input-' + index + '-' + field.name" v-model="field.value">
    </div>
    <button type="button" class="btn btn-primary" @click="closeForm">Cerrar</button>
    </form>
</div>
`
});

// ---------------------------------------------------------------------------
// Componente item-data
// Este componente muestra los datos de la película y alterna entre el bloque de listado y el bloque de edición.
// ---------------------------------------------------------------------------
const ItemData = defineComponent({
props: {
    item: {
    type: Object,
    required: true
    },
    index: {
    type: Number,
    required: false
    }
},
setup(props) {
    // Variable reactiva que controla si se muestra el formulario de edición.
    const isEditing = ref(false);

    // Método para alternar la visibilidad entre la vista de listado y el formulario de edición.
    const toggleEditFormVisibility = () => {
    isEditing.value = !isEditing.value;
    };

    // Función auxiliar para obtener el valor de un campo a partir de su nombre.
    const getValue = (fieldName) => {
    const field = props.item.data.find(d => d.name === fieldName);
    return field ? field.value : '';
    };

    return { isEditing, toggleEditFormVisibility, getValue };
},
template: `
<div class="card mb-4">
    <div class="card-body">
    <template v-if="!isEditing">
        <h5 class="card-title">{{ getValue('name') }}</h5>
        <p class="card-text">{{ getValue('description') }}</p>
        <p><strong>Director:</strong> {{ getValue('director') }}</p>
        <p><strong>Release Date:</strong> {{ getValue('datePublished') }}</p>
        <a :href="item.href" class="btn btn-primary me-2" target="_blank">Ver</a>
        <button class="btn btn-secondary" @click="toggleEditFormVisibility">Editar</button>
    </template>
    <template v-else>
        <edit-form :itemdata="item.data" :index="index" @formClosed="toggleEditFormVisibility" />
    </template>
    </div>
</div>
`
});

// ---------------------------------------------------------------------------
// Crear la aplicación Vue
// ---------------------------------------------------------------------------
const app = createApp({
setup() {
    // Se utiliza reactive para que Vue gestione la reactividad de la colección.
    const col = reactive(server_data.collection);
    return { col };
},
template: `
<div class="container-fluid">
<div class="jumbotron card bg-secondary mb-4">
    <h1 id="title" class="text-center text-white p-4">{{ col.title }}</h1>
</div>
<div class="row row-cols-1 row-cols-md-3 mb-4 g-4">
    <div class="col d-flex" v-for="(item, index) in col.items" :key="index">
    <item-data class="card h-100 w-100" :item="item" :index="index" />
    </div>
</div>
</div>
`
});

// Registrar los componentes globalmente
app.component('edit-form', EditForm);
app.component('item-data', ItemData);

// Montar la aplicación en el elemento con id 'app'
app.mount('#app');