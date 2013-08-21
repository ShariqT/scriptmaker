var Script = {
	content: '',
	$el: $('#script_page'),
	editable_stage: false,
	pages: [],

	showActionForm: function(){
		$('#action').modal('show');
	},

	showDialogueForm: function(){
		//add a ajax call to supply the characters
		var data = [
			'Select A Character',
			'Joseph',
			'Mary',
			'John'
		];
		
		var output = Mustache.render($('#charlist').html(), {char_found: true,characters:data}, {clist: $('#clist').html()});
		$('#character .modal-body').html(output);
		$('#character').modal('show');
	},

	showSlugForm: function(){
		//add a ajax call to supply the slugs
		var data = [
			'Choose A Location',
			'Manger',
			'Bethelem',
			'Galliee'
		];

		var output = Mustache.render($('#slugform').html(), {slugs_found: true, slugs:data}, {slist: $('#previous_slugs').html()});
		$('#slug .modal-body').html(output);
		$('#slug').modal('show');
	},

	atTheEndofPage: function(){
		if(this.$el.height() > 900){
			return true;
		}else{
			return false;
		}
	},

	addNewPage: function(content){
		this.pages.push(this.$el.html());
		console.log(this.pages);
		$('.page-number').html(this.pages.length + 1);
		this.$el.html('');
		this.$el.html(content);
	},

	addContentToPage: function(content){
		if(!this.atTheEndofPage()){
			var html = this.$el.html();
			this.$el.html(html + content);
		}else{
			this.addNewPage(content);
		}
	}
};


var ScriptElement = function(){
	this.text;
	this.template;
	this.$formValue;
}


ScriptElement.prototype.getText = function(){
	this.text = this.$formValue.val();
	return this;
}

ScriptElement.prototype.render = function(){
	console.log(Mustache.render(this.template, {text: this.text}));
	return Mustache.render(this.template, {text: this.text});

}


ScriptElement.prototype.clear = function(){

}

var Action = function(){
	this.template = "<p class='action'>{{text}}</p>";
	this.$formValue = $('textarea[name=text]');
}

Action.prototype = new ScriptElement();

Action.prototype.clear = function(){
	$('textarea[name=text]').val('');
	$('#action').modal('hide');
}


var Slug = function(){

	this.location;
	this.time_of_scene;
	this.slug;
	this.template = "<p class='slugline'>{{location}} {{slug}} - {{time_of_scene}}</p>";
}

Slug.prototype = new ScriptElement();

Slug.prototype.getText = function(){
	//we'll override the default form value because
	//we need many different things to form an accurate slug
	this.location = $('select[name=location]').val();
	this.time_of_scene = $('select[name=time]').val();
	if( $('select[name=slug]').val() != 'Choose A Location'){
		this.slug = $('select[name=slug]').val().toUpperCase();
	}else{
		this.slug = $('input[name=new_slug]').val().toUpperCase();
	}

	return this;
}


Slug.prototype.render = function(){
	return Mustache.render(this.template, {location:this.location, slug: this.slug, time_of_scene: this.time_of_scene});
}

Slug.prototype.clear = function(){
	$('select[name=location]').val('');
	$('select[name=time]').val('');
	$('select[name=slug]').val('Choose A Location');
	$('select[name=new_slug]').val();
	$('#slug').modal('hide');

}

var Character = function(){
	if( $('select[name=character_name]').val() !== 'Select A Character'){
		this.$formValue = $('select[name=character_name]');
		this.is_select = true;
	}else{
		this.$formValue = $('input[name=n_character_name]');
		this.is_select = false;
	}

	this.template = "<div class='character'><p class='name'>{{character}}{{#aside}}<p class='aside'>({{aside}})</p>{{/aside}}</p><p class='dialog'>{{dialogue}}</p></div>";
	this.dialogue;
	this.aside;
	
}

Character.prototype = new ScriptElement();

Character.prototype.getText = function(){
	this.text = this.$formValue.val().toUpperCase();
	this.dialogue = $('textarea[name=dialogue]').val();
	this.aside = $('input[name=aside]').val().toLowerCase();
	return this;
}


Character.prototype.render = function(){
	console.log(this.data);
	return Mustache.render(this.template, {character: this.text, dialogue: this.dialogue, aside: this.aside});
}

Character.prototype.clear = function(){
	if(this.is_select){
		this.$formValue.val('Choose A Character');
	}else{
		this.$formValue.val('');
	}
	$('textarea[name=dialogue]').val('');
	$('input[name=aside]').val();
	$('#character').modal('hide');
}







var script = Script;
var keys = [];
$('#action').modal({
	show: false
});

$('#character').modal({
	show: false
});

$('#slug').modal({
	show: false
});

$('body').on('keydown', function(evt){
	keys.push(evt.which);
	var last_two_keys = keys.slice(-2).toString();
	console.log(last_two_keys);
	if (evt.which == 18){
		evt.preventDefault();
	}

	if( last_two_keys == '18,65'){
		script.showActionForm();
	}

	if(last_two_keys == '18,67'){
		script.showDialogueForm();
	}

	if(last_two_keys == '18,83'){
		script.showSlugForm();
	}


	
});

$('body').on('click', '.addAction', function(event){
	var action = new Action();
	var new_content = action.getText().render();
	action.clear();
	script.addContentToPage(new_content);

});

$('body').on('click', '.addCharacter', function(event){
	var character = new Character();
	var new_content = character.getText().render();
	character.clear();
	script.addContentToPage(new_content);

});

$('body').on('click', '.addSlug', function(event){
	var slug = new Slug();
	var new_content = slug.getText().render();
	slug.clear();
	script.addContentToPage(new_content);
});




var script_page = document.getElementById('script_page');
//script_page.contentEditable = true;


