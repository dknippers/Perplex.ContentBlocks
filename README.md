# Perplex.ContentBlocks

Block based content editor for Umbraco.

This package works on top of NestedContent but provides a more advanced user interface and adds some new features:

- Disable/hide a block
  - Disabled blocks do not show up in the front-end, but their content is still there in Umbraco
- Multiple layouts per block
  - Define more than 1 layout and easily switch between them
  - No need to add properties like an "Image on right side" checkbox
- Preview window showing the front-end of the page
  - This gives content editors a good sense of what they are editing and how the blocks will appear together
  - This uses default Umbraco preview functionality and obviously works with unpublished content as well (if saved)
  - The preview will automatically scroll to the content block that is currently in view in Umbraco
- Larger block picker that shows a preview / title / description for each block
  - This helps editors to distinguish better between available blocks
  - Pickers show blocks in categories to help organization when available block count is high

## Release Notes

Release notes are [available here](RELEASE_NOTES.md).

## Umbraco 14+

Umbraco 14+ no longer supports Nested Content and the Backoffice is completely rewritten using Web Components instead of AngularJS. As a result, all current versions of Perplex.ContentBlocks do not work in Umbraco 14.

The next major version of ContentBlocks - `v4` - will transition from Nested Content as the underlying data storage to Umbraco's Block Editor technology which is used in Block List + Block Grid. In addition we will migrate the property editor UI in the Backoffice from AngularJS to Web Components. It will support Umbraco v14+ _only_.

We intend to release v4 at the end of this year, around the same time as Umbraco v15. This timeline is still subject to change.

In addition to the main package we will release a package that will migrate property data of ContentBlocks v1 - v3 to v4. This is necessary for any websites that upgrade from Umbraco 8-13 to 14+ and have existing ContentBlocks property data. This data needs to be migrated from the Nested Content format to the new Block Editor format. Both editors use Element Types which means the actual property data is the same but they use a different wrapper structure around it so that will have to be migrated.

Until ContentBlocks v4 is out Umbraco 14 is not supported.

## Umbraco 10+ / .NET 6+

ContentBlocks v3 supports the following Umbraco versions:

- 10
- 11
- 12
- 13

It can be installed as usual via NuGet:

`dotnet add package Perplex.ContentBlocks`

For older versions of Umbraco, use v1 or v2.

v3 is backwards compatible with v2 and contains no breaking changes except it no longer supports .NET Framework / Umbraco 8. It adds support for using View Components to render blocks and static files (`App_Plugins\Perplex.ContentBlocks`) are now distributed as part of a Razor Class library (`Perplex.ContentBlocks.StaticAssets`).

When upgrading from v2, make sure to remove the physical `App_Plugins\Perplex.ContentBlocks` folder from your project. The v3 static assets will be loaded from the RCL without being on disk in your project during development.

## Demo

A short demo video can be viewed below.

[![Watch on Vimeo](https://i.vimeocdn.com/video/889556999-4525a3bf7d90804ae264c1c51cdb4f24264fbefe532f883c24924eb721c564cb-d?mw=320)](https://vimeo.com/383278501/ebd95baa0d)

## Installation

The package can be installed using NuGet:

`dotnet add package Perplex.ContentBlocks`

## Quick Start

To start in the quickest way without writing any code, copy the code below to a new file in your project (e.g. `Example.cs`), then compile it and run your site.

If you do not have Visual Studio or another tool to compile code, you can save the code to a `.cs` file in `App_Code` in the root of your project, which should compile it on the fly. If the folder does not exist yet simply create it.

For a more detailed explanation and step-by-step guide, head over to [Getting Started](#getting-started).

<details>
<summary><strong>Click to show Umbraco v8 code</strong></summary>

```csharp
using Perplex.ContentBlocks.Definitions;
using System;
using Umbraco.Core.Composing;
using Umbraco.Core.Models;
using Umbraco.Core.PropertyEditors;
using Umbraco.Core.Services;
using Umbraco.Web.PropertyEditors;
using static Umbraco.Core.Constants;

namespace ExampleSite
{
    public class ExampleComponent : IComponent
    {
        private readonly IContentBlockDefinitionRepository _definitions;
        private readonly PropertyEditorCollection _propertyEditors;
        private readonly IDataTypeService _dataTypeService;
        private readonly IContentTypeService _contentTypeService;

        public ExampleComponent(
            IContentBlockDefinitionRepository definitions,
            PropertyEditorCollection propertyEditors,
            IDataTypeService dataTypeService,
            IContentTypeService contentTypeService)
        {
            _definitions = definitions;
            _propertyEditors = propertyEditors;
            _dataTypeService = dataTypeService;
            _contentTypeService = contentTypeService;
        }

        public void Initialize()
        {
            Guid dataTypeKey = new Guid("ec17fffe-3a33-4a08-a61a-3a6b7008e20f");
            CreateExampleBlock("exampleBlock", dataTypeKey);

            // Block
            var block = new ContentBlockDefinition
            {
                Name = "Example Block",
                Id = new Guid("11111111-1111-1111-1111-111111111111"),
                DataTypeKey = dataTypeKey,
                // PreviewImage will usually be a path to some image,
                // for this demo we use a base64-encoded PNG of 3x2 pixels
                PreviewImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAATSURBVAiZYzzDwPCfAQqYGJAAACokAc/b6i7NAAAAAElFTkSuQmCC",
                Description = "Example Block",

                Layouts = new IContentBlockLayout[]
                    {
                        new ContentBlockLayout
                        {
                            Id = new Guid("22222222-2222-2222-2222-222222222222"),
                            Name = "Red",
                            Description = "",
                            PreviewImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAATSURBVAiZYzzDwPCfAQqYGJAAACokAc/b6i7NAAAAAElFTkSuQmCC",
                            ViewPath = "~/Views/Partials/ExampleBlock/Red.cshtml"
                        },
                        new ContentBlockLayout
                        {
                            Id = new Guid("33333333-3333-3333-3333-333333333333"),
                            Name = "Green",
                            Description = "",
                            PreviewImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAATSURBVAiZYyy+JPafAQqYGJAAADcdAl5UlCmyAAAAAElFTkSuQmCC",
                            ViewPath = "~/Views/Partials/ExampleBlock/Green.cshtml"
                        },
                        new ContentBlockLayout
                        {
                            Id = new Guid("44444444-4444-4444-4444-444444444444"),
                            Name = "Blue",
                            Description = "",
                            PreviewImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAATSURBVAiZYzRJXfKfAQqYGJAAADOAAkAWXApqAAAAAElFTkSuQmCC",
                            ViewPath = "~/Views/Partials/ExampleBlock/Blue.cshtml",
                        },
                    },

                CategoryIds = new[]
                {
                    Perplex.ContentBlocks.Constants.Categories.Content,
                }
            };

            // Header
            var header = new ContentBlockDefinition
            {
                Name = "Example Header",
                Id = new Guid("55555555-5555-5555-5555-555555555555"),
                DataTypeKey = dataTypeKey,
                PreviewImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAATSURBVAiZY/zz0v8/AxQwMSABAEvFAzckGfK1AAAAAElFTkSuQmCC",
                Description = "Example Block",

                Layouts = new IContentBlockLayout[]
                    {
                        new ContentBlockLayout
                        {
                            Id = new Guid("66666666-6666-6666-6666-666666666666"),
                            Name = "Yellow",
                            Description = "",
                            PreviewImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAATSURBVAiZY/zz0v8/AxQwMSABAEvFAzckGfK1AAAAAElFTkSuQmCC",
                            ViewPath = "~/Views/Partials/ExampleHeader/Yellow.cshtml"
                        },
                        new ContentBlockLayout
                        {
                            Id = new Guid("77777777-7777-7777-7777-777777777777"),
                            Name = "Magenta",
                            Description = "",
                            PreviewImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAATSURBVAiZY/zP8P8/AxQwMSABAEYIAwEl5g6iAAAAAElFTkSuQmCC",
                            ViewPath = "~/Views/Partials/ExampleHeader/Magenta.cshtml"
                        },
                    },

                CategoryIds = new[]
                {
                    Perplex.ContentBlocks.Constants.Categories.Headers,
                }
            };

            _definitions.Add(block);
            _definitions.Add(header);
        }

        private void CreateExampleBlock(string contentTypeAlias, Guid dataTypeKey)
        {
            CreateExampleBlockElementType(contentTypeAlias);
            CreateExampleBlockDataType(contentTypeAlias, dataTypeKey);
        }

        private void CreateExampleBlockElementType(string contentTypeAlias)
        {
            if (_contentTypeService.Get(contentTypeAlias) != null)
            {
                // Already created
                return;
            }

            IContentType contentType = new ContentType(-1)
            {
                Alias = contentTypeAlias,
                IsElement = true,
                Name = "Example Block",
                PropertyGroups = new PropertyGroupCollection(new[]
                {
                    new PropertyGroup(new PropertyTypeCollection(true, new[]
                    {
                        new PropertyType(PropertyEditors.Aliases.TextBox, ValueStorageType.Ntext)
                        {
                            PropertyEditorAlias = PropertyEditors.Aliases.TextBox,
                            Name = "Title",
                            Alias = "title",
                        },
                        new PropertyType(PropertyEditors.Aliases.TextBox, ValueStorageType.Ntext)
                        {
                            PropertyEditorAlias = PropertyEditors.Aliases.TinyMce,
                            Name = "Text",
                            Alias = "text",
                        },
                    }))
                    {
                        Name = "Content",
                    }
                })
            };

            _contentTypeService.Save(contentType);
        }

        private void CreateExampleBlockDataType(string contentTypeAlias, Guid dataTypeKey)
        {
            if (_dataTypeService.GetDataType(dataTypeKey) != null)
            {
                // Already there
                return;
            }

            if (!(_propertyEditors.TryGet("Umbraco.NestedContent", out var editor) &&
                editor is NestedContentPropertyEditor nestedContentEditor))
            {
                throw new InvalidOperationException("Nested Content property editor not found!");
            }

            var dataType = new DataType(nestedContentEditor, -1)
            {
                Name = "Perplex.ContentBlocks - ExampleBlock",
                Key = dataTypeKey,
                Configuration = new NestedContentConfiguration
                {
                    ConfirmDeletes = false,
                    HideLabel = true,
                    MinItems = 1,
                    MaxItems = 1,
                    ShowIcons = false,
                    ContentTypes = new[]
                    {
                        new NestedContentConfiguration.ContentType
                        {
                            Alias = contentTypeAlias,
                            TabAlias = "Content",
                            Template = "{{title}}"
                        }
                    }
                }
            };

            _dataTypeService.Save(dataType);
        }

        public void Terminate()
        {
        }
    }

    [RuntimeLevel(MinLevel = Umbraco.Core.RuntimeLevel.Run)]
    public class ExampleComposer : ComponentComposer<ExampleComponent> { }
}
```

</details>

<details>
<summary><strong>Click to show Umbraco v9+ code</strong></summary>

```csharp
using Perplex.ContentBlocks.Definitions;
using System;
using Umbraco.Core.Composing;
using Umbraco.Core.Models;
using Umbraco.Core.PropertyEditors;
using Umbraco.Core.Services;
using Umbraco.Web.PropertyEditors;
using static Umbraco.Core.Constants;

namespace ExampleSite
{
    public class ExampleComponent : IComponent
    {
        private readonly IShortStringHelper _stringHelper;
        private readonly IConfigurationEditorJsonSerializer _serializer;
        private readonly IContentBlockDefinitionRepository _definitions;
        private readonly PropertyEditorCollection _propertyEditors;
        private readonly IDataTypeService _dataTypeService;
        private readonly IContentTypeService _contentTypeService;

        public ExampleComponent(
            IShortStringHelper stringHelper,
            IConfigurationEditorJsonSerializer serializer,
            IContentBlockDefinitionRepository definitions,
            PropertyEditorCollection propertyEditors,
            IDataTypeService dataTypeService,
            IContentTypeService contentTypeService)
        {
            _stringHelper = stringHelper;
            _serializer = serializer;
            _definitions = definitions;
            _propertyEditors = propertyEditors;
            _dataTypeService = dataTypeService;
            _contentTypeService = contentTypeService;
        }

        public void Initialize()
        {
            Guid dataTypeKey = new Guid("ec17fffe-3a33-4a08-a61a-3a6b7008e20f");
            CreateExampleBlock("exampleBlock", dataTypeKey);

            // Block
            var block = new ContentBlockDefinition
            {
                Name = "Example Block",
                Id = new Guid("11111111-1111-1111-1111-111111111111"),
                DataTypeKey = dataTypeKey,
                // PreviewImage will usually be a path to some image,
                // for this demo we use a base64-encoded PNG of 3x2 pixels
                PreviewImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAATSURBVAiZYzzDwPCfAQqYGJAAACokAc/b6i7NAAAAAElFTkSuQmCC",
                Description = "Example Block",

                Layouts = new IContentBlockLayout[]
                    {
                        new ContentBlockLayout
                        {
                            Id = new Guid("22222222-2222-2222-2222-222222222222"),
                            Name = "Red",
                            Description = "",
                            PreviewImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAATSURBVAiZYzzDwPCfAQqYGJAAACokAc/b6i7NAAAAAElFTkSuQmCC",
                            ViewPath = "~/ExampleComponent/Views/Partials/ExampleBlock/Red.cshtml"
                        },
                        new ContentBlockLayout
                        {
                            Id = new Guid("33333333-3333-3333-3333-333333333333"),
                            Name = "Green",
                            Description = "",
                            PreviewImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAATSURBVAiZYyy+JPafAQqYGJAAADcdAl5UlCmyAAAAAElFTkSuQmCC",
                            ViewPath = "~/ExampleComponent/Views/Partials/ExampleBlock/Green.cshtml"
                        },
                        new ContentBlockLayout
                        {
                            Id = new Guid("44444444-4444-4444-4444-444444444444"),
                            Name = "Blue",
                            Description = "",
                            PreviewImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAATSURBVAiZYzRJXfKfAQqYGJAAADOAAkAWXApqAAAAAElFTkSuQmCC",
                            ViewPath = "~/ExampleComponent/Views/Partials/ExampleBlock/Blue.cshtml",
                        },
                    },

                CategoryIds = new[]
                {
                    Perplex.ContentBlocks.Constants.Categories.Content,
                }
            };

            // Header
            var header = new ContentBlockDefinition
            {
                Name = "Example Header",
                Id = new Guid("55555555-5555-5555-5555-555555555555"),
                DataTypeKey = dataTypeKey,
                PreviewImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAATSURBVAiZY/zz0v8/AxQwMSABAEvFAzckGfK1AAAAAElFTkSuQmCC",
                Description = "Example Block",

                Layouts = new IContentBlockLayout[]
                    {
                        new ContentBlockLayout
                        {
                            Id = new Guid("66666666-6666-6666-6666-666666666666"),
                            Name = "Yellow",
                            Description = "",
                            PreviewImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAATSURBVAiZY/zz0v8/AxQwMSABAEvFAzckGfK1AAAAAElFTkSuQmCC",
                            ViewPath = "~/ExampleComponent/Views/Partials/ExampleHeader/Yellow.cshtml"
                        },
                        new ContentBlockLayout
                        {
                            Id = new Guid("77777777-7777-7777-7777-777777777777"),
                            Name = "Magenta",
                            Description = "",
                            PreviewImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAATSURBVAiZY/zP8P8/AxQwMSABAEYIAwEl5g6iAAAAAElFTkSuQmCC",
                            ViewPath = "~/ExampleComponent/Views/Partials/ExampleHeader/Magenta.cshtml"
                        },
                    },

                CategoryIds = new[]
                {
                    Perplex.ContentBlocks.Constants.Categories.Headers,
                }
            };

            _definitions.Add(block);
            _definitions.Add(header);
        }

        private void CreateExampleBlock(string contentTypeAlias, Guid dataTypeKey)
        {
            CreateExampleBlockElementType(contentTypeAlias);
            CreateExampleBlockDataType(contentTypeAlias, dataTypeKey);
        }

        private void CreateExampleBlockElementType(string contentTypeAlias)
        {
            if (_contentTypeService.Get(contentTypeAlias) != null)
            {
                // Already created
                return;
            }

            IContentType contentType = new ContentType(_stringHelper, -1)
            {
                Alias = contentTypeAlias,
                IsElement = true,
                Name = "Example Block",
                PropertyGroups = new PropertyGroupCollection(new[]
                {
                    new PropertyGroup(new PropertyTypeCollection(true, new[]
                    {
                        new PropertyType(_stringHelper, PropertyEditors.Aliases.TextBox, ValueStorageType.Ntext)
                        {
                            PropertyEditorAlias = PropertyEditors.Aliases.TextBox,
                            Name = "Title",
                            Alias = "title",
                        },
                        new PropertyType(_stringHelper, PropertyEditors.Aliases.TextBox, ValueStorageType.Ntext)
                        {
                            PropertyEditorAlias = PropertyEditors.Aliases.TinyMce,
                            Name = "Text",
                            Alias = "text",
                        },
                    }))
                    {
                        Name = "Content",
                        Alias = "content"
                    }
                })
            };

            _contentTypeService.Save(contentType);
        }

        private void CreateExampleBlockDataType(string contentTypeAlias, Guid dataTypeKey)
        {
            if (_dataTypeService.GetDataType(dataTypeKey) != null)
            {
                // Already there
                return;
            }

            if (!(_propertyEditors.TryGet("Umbraco.NestedContent", out var editor) &&
                editor is NestedContentPropertyEditor nestedContentEditor))
            {
                throw new InvalidOperationException("Nested Content property editor not found!");
            }

            var dataType = new DataType(nestedContentEditor, _serializer, -1)
            {
                Name = "Perplex.ContentBlocks - ExampleBlock",
                Key = dataTypeKey,
                Configuration = new NestedContentConfiguration
                {
                    ConfirmDeletes = false,
                    HideLabel = true,
                    MinItems = 1,
                    MaxItems = 1,
                    ShowIcons = false,
                    ContentTypes = new[]
                    {
                        new NestedContentConfiguration.ContentType
                        {
                            Alias = contentTypeAlias,
                            TabAlias = "Content",
                            Template = "{{title}}"
                        }
                    }
                }
            };

            _dataTypeService.Save(dataType);
        }

        public void Terminate()
        {
        }
    }

    [RuntimeLevel(MinLevel = Umbraco.Core.RuntimeLevel.Run)]
    public class ExampleComposer : ComponentComposer<ExampleComponent> { }
}
```

</details>

This code will:

1. Create a Document Type "Example Block" with the alias "exampleBlock" and two properties "Title" (text) and "Text" (rich text editor)
2. Create a NestedContent data type for it called "Perplex.Contentblocks - ExampleBlock"
3. Configure a Header and a Block to use the data type

What you now can do in your solution is:

1. Create a **new data type** based on the `Perplex.ContentBlocks` property editor. Call it "Perplex Contentblocks"

![perplex contentblocks](https://user-images.githubusercontent.com/12457148/137145854-f09786d4-c00f-4d44-9453-e96d0fb94764.png)

2. Add this property to a document type of your choice

   ![Add to document type](https://user-images.githubusercontent.com/12457148/137146090-13c0962a-4480-492b-b07f-c2610e74297f.png)

3. You should now be able to pick blocks on a content page of the document type.

![Contentpage](https://user-images.githubusercontent.com/12457148/137146271-76dcf700-5bbc-44a5-9054-ad8aed211fdf.png)

Also note this does not cover the front-end rendering yet, so nothing will happen there yet.
Head over to the [Rendering Content Blocks](#rendering-content-blocks) section for an explanation about that.

## Getting Started

In order to use this package, you will need to configure at least 1 Content Block.

After that is done, you can add the data type `Perplex.ContentBlocks` as a property to any document type where you want to use this content editor.

Because ContentBlocks is built on top of Nested Content, creating a block starts out the same as creating a new Nested Content data type. After that, there is a little bit of extra work to make the Nested Content data type work as a block within ContentBlocks.

In short, the steps to configure a Content Block are:

1. Create a document type

   - Add any properties you need for the Content Block
   - Tick "Is an element type" in Permissions

2. Create a data type based on Nested Content

   - Select the document type created in step 1
   - Set min. items and max. items to 1
   - Hide the label

3. Describe the Content Block using an implementation of the `IContentBlockDefinition` interface.

   - See [Content Block Definition](#content-block-definition) for the documentation of all properties of `IContentBlockDefinition`.

4. Add the definition created in step 3 to an `IContentBlockRepository`

   - Either use the built-in repository:

     ```csharp
     // Inject
     IContentBlockDefinitionRepository definitions;

     // Your definition
     var definition = new ContentBlockDefinition { /* ... */ };

     // Add to the repository
     definitions.Add(definition);
     ```

   - Or register your own implementation in a composer and register it there:
     ```csharp
     composition.RegisterUnique<IContentBlockDefinitionRepository, MyDefinitionRepository>();
     ```
     - Make sure your composer runs after the `ContentBlockDefinitionComposer`.

### Content Block Definition

The definition of a Content Block consists of the following properties:

- Id
  - Unique identifier of this definition. You have to create a Guid yourself and set it.
- Name
  - Name of the Content Block.
- Description
  - Description of this Content Block.
- PreviewImage
  - Image that shows in the UI as a preview of this block. Relative path from the root of your site to an image.
- DataTypeId / DataTypeKey
  - The Id (int) or Key (Guid) of the data type that was created for this Content Block.
    - Either the DataTypeId OR the DataTypeKey has to be set
- CategoryIds
  - List of ids of the categories this Content Block should appear in. This references the id of a `IContentBlockCategory`. See [Content Block Categories](#content-block-categories) for more details on categories.
- Layouts
  - List of all layouts of this Content Block. See [Content Block Layout](#content-block-layout) below.
- LimitToDocumentTypes
  - List of document type aliases. When configured, the Content Block will only be available on pages of these document types.
- LimitToCultures
  - List of cultures (e.g. "en-US"). When configured, the Content Block will only be available on pages of these cultures.

### Content Block Layout

Each Content Block has at least 1 layout. This refers to the view that will be rendered. It is possible to define multiple layouts per block. The user will be able to switch layouts from Umbraco.
A layout is described using an implementation of `IContentBlockLayout`, which has the following properties:

- Id
  - Unique identifier of this definition. You have to create a Guid yourself and set it.
- Name
  - Name of this layout.
- Description
  - Description of this layout. This is displayed in the layout picker (Add Content > Pick Layout).
- PreviewImage
  - Preview image to use in the layout picker UI. Should be a full path from the root of your site to the image, e.g. `"/img/exampleBlock/red.png"`
- ViewPath
  - Path to the View file of this layout, e.g. `"~/Views/Partials/ExampleBlock/Red.cshtml"`

### Content Block Categories

Content Blocks are organized in categories and presented that way to the user. The categories are retrieved from a registered `IContentBlockCategoryRepository`. By default, this package contains two categories: "Headers" and "Content". Their ids are available as constants in `Perplex.ContentBlocks.Constants.Categories`. You can manipulate these categories by either:

- Inject the `IContentBlockCategoryRepository` and call `Add()` / or `Remove()` to add / remove entries.

OR

- Register a custom implementation of the `IContentBlockCategoryRepository`:
  ```
  composition.RegisterUnique<IContentBlockCategoryRepository, MyCategoryRepository>();
  ```
  - Make sure your composer runs after the `ContentBlockCategoriesComposer`.

## Rendering Content Blocks

To render all Content Blocks from the page containing the blocks, you can either use the `IContentBlockRenderer` directly, or call an extension method with the Content Blocks model value (of type `IContentBlocks`). In v3 we added a tag helper for rendering.

The examples assume the property alias of the Perplex.ContentBlocks property is `"contentBlocks"` which translates to a ModelsBuilder property of `ContentBlocks`. In both cases we run the example code in the Razor view file of the document type that contains the Content Blocks (e.g. `Homepage.cshtml`):

1. Using the tag helper (v3+):

Ensure the Tag Helper is imported in your views by adding it to `_ViewImports.cshtml`:

`@addTagHelper *, Perplex.ContentBlocks`

```csharp
// All blocks (header + blocks):
<perplex-content-blocks content="Model.ContentBlocks" />

// A single block (e.g. header only)
<perplex-content-blocks block="Model.ContentBlocks.Header" />

// Multiple blocks (e.g. all blocks except header)
<perplex-content-blocks blocks="Model.ContentBlocks.Blocks" />
```

2. Using the extension method (deprecated in v3 as it does not support rendering view components):

```csharp
// ContentBlocks v2 - Umbraco v8
@using Perplex.ContentBlocks.Rendering;
@Html.RenderContentBlocks(Model.ContentBlocks)

// ContentBlocks v2 - Umbraco v9+
@using Perplex.ContentBlocks.Rendering;
@inject IContentBlockRenderer Renderer
@await Html.RenderContentBlocks(Model.ContentBlocks, Renderer)
```

3. Using the renderer:

```csharp
// Umbraco v8
@{
    // Inject
    IContentBlockRenderer renderer;
}
@renderer.Render(Model.ContentBlocks, Html)

// Umbraco v9+
@inject IContentBlockRenderer Renderer
@await Renderer.Render(Model.ContentBlocks, Html.PartialAsync)

// ContentBlocks v3+
@inject IContentBlocksRenderer Renderer
@await Renderer.RenderAsync(Model.Content.ContentBlocks, Component.InvokeAsync, Html.PartialAsync)
```

### Rendering a Content Block

The renderer will render each Content Block by using their configured View and pass in a generic `IContentBlockViewModel<TContent>` where `TContent` is the ModelsBuilder type of the content.

Because this `TContent` is a ModelsBuilder model, you can either use strongly typed properties or the `.Value()` method to render its properties.

An example Content Block view file for a Content Block with document type alias `"exampleBlock"` and ModelsBuilder model `ExampleBlock` will look something like this:

```csharp
@using Perplex.ContentBlocks.Rendering;
@model IContentBlockViewModel<ExampleBlock>
<h1>@Model.Content.Title</h1>
<img src="@Model.Content.Image.Url" />
```

The `Model.Content` property is the `IPublishedElement` of the Content Block content and rendering them is the same as rendering any Umbraco content in the front-end.

## Advanced

### Render Blocks using View Components

Starting with ContentBlocks v3 you can use `IContentBlockDefinition<T>` where `T` is a `ViewComponent`. When rendering your block, this `ViewComponent` will be called with a `IContentBlockViewModel<TModel>` parameter. This is useful if you want to use custom logic or a custom view model to render your blocks.

For example, with a ContentBlock definition like this:

```csharp
new ContentBlockDefinition<SampleBlockViewComponent> // Note the <SampleBlockViewComponent>
{
    Name = "Sample Block",
    Id = new Guid("..."),
    DataTypeKey = new Guid("..."),
    Layouts = new []
    {
        new ContentBlockLayout
        {
            Id = new Guid("..."),
            Name = "Default",
            PreviewImage = "...",
            ViewPath = "..." // Optional when using ViewComponents
        },
    }
};
```

You can use a ViewComponent to render this block like this:

```csharp
public class SampleBlockViewComponent : ViewComponent
{
    private readonly ISomeService _someService; // Some service required for your use case
    public SampleBlockViewComponent(ISomeService someService) => _someService = someService;

    public async Task<IViewComponentResult> InvokeAsync(IContentBlockViewModel<SampleBlock> model)
    {
        var someValue = await _someService.GetValueAsync();
        var viewModel = new SampleBlockViewModel(model, someValue);
        return View("/Path/To/SampleBlock_View.cshtml", viewModel);
    }

    // Or the sync version:
    // public IViewComponentResult Invoke(IContentBlockViewModel<SampleBlock> model)
    // {
    //     var someValue = _someService.GetValue();
    //     var viewModel = new SampleBlockViewModel(model, someValue);
    //     return View("/Path/To/SampleBlock_View.cshtml", viewModel);
    // }
}

```

### Custom View Model

Sometimes you need a more complex view model than just the `IContentBlockViewModel<TContent>`. In this case, you can register a custom view model factory that will generate your custom view model for you.

> Note that starting with v3 you can use View Components to render your blocks which is the recommended approach instead of the ViewModelFactory approach described in this section.

For example, if you have the ContentBlock `ExampleBlock` and instead of the default `IContentBlockViewModel<TContent>` you want some custom view model `ExampleBlockViewModel`, this is what you do:

1.  Create your View Model with some additional properties.
    - This custom view model should implement `IContentBlockViewModel`
    - The example below inherits from the built-in class `ContentBlockViewModel<TContent>`, this is the easiest way
    - Note the `IEnvironment` we add to the view model is **only an example**. Likewise, we inject some `IEnvironmentProvider` to obtain that `IEnvironment` which is also an example to show how you would inject your own classes.

```csharp
public class ExampleBlockViewModel : ContentBlockViewModel<ExampleBlock>
{
    // In this example we add some "IEnvironment" property to our view model.
    // Note this is just an example, there is no need to include this property on your
    // custom view model to make it work.
    public IEnvironment Environment { get; }

    public ExampleBlockViewModel(ExampleBlock content, Guid id, Guid definitionId, Guid layoutId,
        IEnvironmentProvider environmentProvider)
        : base(content, id, definitionId, layoutId)
    {
        Environment = environmentProvider.GetEnvironment();
    }
}
```

2. Create a View Model factory that is used to create this view model:
   - This factory should implement `IContentBlockViewModelFactory<TContent>`.
   - The easiest way is to inherit from `ContentBlockViewModelFactory<TContent>` like we do below, and override its `Create` method.

```csharp
public class ExampleBlockViewModelFactory : ContentBlockViewModelFactory<ExampleBlock>
{
    private readonly IEnvironmentProvider _environmentProvider;

    // Inject the required dependencies into the factory.
    // Note the "IEnvironmentProvider" is just an example,
    // you want to inject your own dependencies here.
    public ExampleBlockViewModelFactory(IEnvironmentProvider environmentProvider)
    {
        _environmentProvider = environmentProvider;
    }

    public override IContentBlockViewModel<ExampleBlock> Create(
        ExampleBlock content, Guid id, Guid definitionId, Guid layoutId)
    {
        // Pass dependencies to the ExampleBlockViewModel constructor,
        // we pass our IEnvironmentProvider in this example but
        // you want to pass your own dependencies instead.
        return new ExampleBlockViewModel(content, id, definitionId, layoutId, _environmentProvider);
    }
}
```

3. Register your view model factory in some `IUserComposer`:

```csharp
composition.Register(
    typeof(IContentBlockViewModelFactory<ExampleBlock>),
    typeof(ExampleBlockViewModelFactory),
    Lifetime.Scope);
```

4. Use the view model in your view (`ExampleBlock.cshtml`):

```csharp
@model ExampleBlockViewModel

@if(Model.Environment.IsDevelopment()) {
    @RenderDebugInfo()
}

@* Other properties as usual *@
<h1>@Model.Content.Title</h1>
```

### Content Block Presets

It is possible to define a "Preset", which is a predefined selection of Header + Blocks to be pre-filled when a page does not have any blocks yet.

Presets implement the interface `IContentBlocksPreset` and should be added to an `IContentBlocksPresetRepository`.

An `IContentBlocksPreset` has the following properties:

- Id
  - Unique identifier of this preset. You have to create a Guid yourself and set it.
- Name
  - Name of this preset. This property is _not displayed_ in the UI.
- Header
  - `IContentBlockPreset` referencing an existing `IContentBlockDefinition` to set as Header.
- Blocks
  - `IEnumerable<IContentBlockPreset>`, each referencing an existing `IContentBlockDefinition`
    to set as a Block.
- ApplyToCultures
  - Cultures to apply this preset to (e.g. `"en-US"`)
- ApplyToDocumentTypes
  - Document type alias to apply this preset to (e.g. `"homepage"`)

### Preset initial property values

Starting from version 1.8.0 it is possible to provide initial property values for an `IContentBlockPreset` using its `Values` property which is an `IDictionary<string, object>`. Usage:

```csharp
new ContentBlockPreset
{
    Id = ...,
    DefinitionId = ...,
    LayoutId = ...,
    Values =
    {
        // For example, to set the initial values for properties "title" and "text":
        ["title"] = "Default title here",
        ["text"] = "<p>Lorem ipsum ...</p>"
    },
},
```

### Creating Content Blocks programmatically

There are no specialized APIs in our package to create Content Blocks through code but you can use Umbraco's `IContentService` and use `SetValue()` to set a ContentBlocks property value. The value should be a JSON string and the structure is shown below. The main task is generating that "Nested Content data" part.

```javascript
{
    /* version can change in the future if the model value structure changes, but that is unlikely */
    "version": 2,
    "header": {
        "id": "...",
        "definitionId": "...",
        "layoutId": "...",
        "presetId": null,
        "isDisabled": false,
        "content": [
            {
                /* Nested Content data */
            }
        ]
    },

    "blocks": [
        /* Same format as header */
    ]
}
```
